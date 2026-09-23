import { Request, Response } from "express";
import { sequelize } from "../config/sequelize";
import Cart from "../models/cartModel";
import CartItem from "../models/cartItemModel";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import OrderItem from "../models/orderItemModel";
import Payment from "../models/paymentModel";
import AppError from "../utils/AppError";

// =====================================================
// CREATE ORDER
// =====================================================

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const order = await sequelize.transaction(async (transaction) => {
    // 1. Find and lock the user's cart
    const cart = await Cart.findOne({
      where: { userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!cart) {
      throw new AppError("Cart not found.", 404);
    }

    // 2. Get and lock cart items
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (cartItems.length === 0) {
      throw new AppError("Cart is empty.", 400);
    }

    // 3. Validate quantities
    for (const item of cartItems) {
      if (item.quantity <= 0) {
        throw new AppError(
          "Cart contains an invalid quantity.",
          400
        );
      }
    }

    // Sort items so product locks are acquired
    // in a consistent order.
    const sortedItems = [...cartItems].sort(
      (a, b) => a.productId - b.productId
    );

    // Store locked products here
    const products = new Map<number, Product>();

    // 4. Find and lock products
    for (const item of sortedItems) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw new AppError(
          `Product ${item.productId} not found.`,
          404
        );
      }

      products.set(product.id, product);
    }

    // 5. Check stock and calculate total
    let total = 0;

    for (const item of cartItems) {
      const product = products.get(item.productId);

      if (!product) {
        throw new AppError("Product not found.", 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Not enough stock for ${product.name}.`,
          400
        );
      }

      // Price comes from the database,
      // NOT from the customer request.
      total += Number(product.price) * item.quantity;
    }

    // 6. Create the order
    const order = await Order.create(
      {
        userId,
        total,
        status: "pending",
      },
      { transaction }
    );

    // 7. Create order items and reduce stock
    for (const item of cartItems) {
      const product = products.get(item.productId);

      if (!product) {
        throw new AppError("Product not found.", 404);
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * item.quantity;

      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        },
        { transaction }
      );

      product.stock -= item.quantity;

      await product.save({ transaction });
    }

    // 8. Clear the cart
    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction,
    });

    // Returning the order allows Sequelize
    // to commit the transaction.
    return order;
  });

  res.status(201).json({
    message: "Order created successfully.",
    order,
  });
};

// =====================================================
// GET MY ORDERS
// =====================================================

export const getOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const orders = await Order.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    orders,
  });
};

// =====================================================
// GET ONE ORDER
// =====================================================

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const order = await Order.findOne({
    where: {
      id,
      userId,
    },
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Product,
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  res.status(200).json({
    order,
  });
};

// =====================================================
// CANCEL ORDER
// =====================================================

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const order = await sequelize.transaction(async (transaction) => {
    // 1. Find and lock the customer's order
    const order = await Order.findOne({
      where: {
        id,
        userId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    // 2. Only pending orders can be cancelled
    if (order.status !== "pending") {
      throw new AppError(
        "Only pending orders can be cancelled.",
        400
      );
    }

    // 3. Check the payment status
    const payment = await Payment.findOne({
      where: {
        orderId: order.id,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    // 4. Paid orders cannot be cancelled
    if (payment?.status === "paid") {
      throw new AppError(
        "Paid orders cannot be cancelled. Please contact support for a refund.",
        400
      );
    }

    // 5. Get order items
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: order.id,
      },
      transaction,
    });

    // 6. Restore product stock
    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (product) {
        product.stock += item.quantity;

        await product.save({
          transaction,
        });
      }
    }

    // 7. Mark order as cancelled
    order.status = "cancelled";

    await order.save({
      transaction,
    });

    return order;
  });

  res.status(200).json({
    message: "Order cancelled and stock restored successfully.",
    order,
  });
};