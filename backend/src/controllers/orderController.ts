import { Request, Response } from "express";
import Cart from "../models/cartModel";
import CartItem from "../models/cartItemModel";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import OrderItem from "../models/orderItemModel";
import AppError from "../utils/AppError";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  // 1. Find the user's cart
  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  // 2. Get all items in the cart
  const cartItems = await CartItem.findAll({
    where: {
      cartId: cart.id,
    },
  });

  if (cartItems.length === 0) {
    throw new AppError("Cart is empty.", 400);
  }

  // 3. Find the products for each cart item
  const products = await Promise.all(
    cartItems.map((item) => Product.findByPk(item.productId))
  );

  // 4. Check that all products exist
  if (products.some((product) => !product)) {
    throw new AppError(
      "One or more products not found.",
      404
    );
  }

  // 5. Calculate the order total
  let total = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products[i];

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Not enough stock for ${product.name}.`,
        400
      );
    }

    total += Number(product.price) * item.quantity;
  }

  // 6. Create the order
  const order = await Order.create({
    userId,
    total,
    status: "pending",
  });

  // 7. Create order items and reduce stock
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products[i];

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    // Create the order item
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    });

    // Reduce product stock
    product.stock -= item.quantity;

    await product.save();
  }

  // 8. Clear the cart
  await CartItem.destroy({
    where: {
      cartId: cart.id,
    },
  });

  // 9. Return the created order
  res.status(201).json({
    message: "Order created successfully.",
    order,
  });
};


export const getOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const orders = await Order.findAll({
    where: {
      userId,
    },
  });

  res.status(200).json({
    orders,
  });
};


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


export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { status } = req.body;

  // 1. Check authentication
  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  // 2. Check if status was provided
  if (!status) {
    throw new AppError("Status is required.", 400);
  }

  // 3. Check if the status is valid
  const allowedStatuses = [
    "pending",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid order status.", 400);
  }

  // 4. Find the order belonging to the logged-in user
  const order = await Order.findOne({
    where: {
      id,
      userId,
    },
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // 5. Define allowed status transitions
  const validTransitions: Record<string, string[]> = {
    pending: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  // 6. Get the allowed transitions
  const allowedTransitions =
    validTransitions[order.status] || [];

  // 7. Check if the requested transition is allowed
  if (!allowedTransitions.includes(status)) {
    throw new AppError(
      `Cannot change order status from ${order.status} to ${status}.`,
      400
    );
  }

  // 8. Update the order status
  order.status = status;

  await order.save();

  // 9. Return the updated order
  res.status(200).json({
    message: "Order updated successfully.",
    order,
  });
};


export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  // Find the order belonging to the logged-in user
  const order = await Order.findOne({
    where: {
      id,
      userId,
    },
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // Delete all order items belonging to this order
  await OrderItem.destroy({
    where: {
      orderId: order.id,
    },
  });

  // Delete the order
  await order.destroy();

  res.status(200).json({
    message: "Order deleted successfully.",
  });
};


export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  // Find the order belonging to the logged-in user
  const order = await Order.findOne({
    where: {
      id,
      userId,
    },
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // Only pending orders can be cancelled
  if (order.status !== "pending") {
    throw new AppError(
      "Only pending orders can be cancelled.",
      400
    );
  }

  // Get the items belonging to this order
  const orderItems = await OrderItem.findAll({
    where: {
      orderId: order.id,
    },
  });

  // Restore the stock for each product
  for (const item of orderItems) {
    const product = await Product.findByPk(item.productId);

    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  // Mark the order as cancelled
  order.status = "cancelled";

  await order.save();

  // Return the cancelled order
  res.status(200).json({
    message: "Order cancelled and stock restored successfully.",
    order,
  });
};