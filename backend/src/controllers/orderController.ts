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

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  const cartItems = await CartItem.findAll({
    where: {
      cartId: cart.id,
    },
  });

  if (cartItems.length === 0) {
    throw new AppError("Cart is empty.", 400);
  }

  const products = await Promise.all(
    cartItems.map((item) => Product.findByPk(item.productId))
  );

  if (products.some((product) => !product)) {
    throw new AppError(
      "One or more products not found.",
      404
    );
  }

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

  const order = await Order.create({
    userId,
    total,
    status: "pending",
  });

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products[i];

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    });

    product.stock -= item.quantity;

    await product.save();
  }

  await CartItem.destroy({
    where: {
      cartId: cart.id,
    },
  });

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

export const cancelOrder = async (
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
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  if (order.status !== "pending") {
    throw new AppError(
      "Only pending orders can be cancelled.",
      400
    );
  }

  const orderItems = await OrderItem.findAll({
    where: {
      orderId: order.id,
    },
  });

  for (const item of orderItems) {
    const product = await Product.findByPk(item.productId);

    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.status = "cancelled";

  await order.save();

  res.status(200).json({
    message: "Order cancelled and stock restored successfully.",
    order,
  });
};