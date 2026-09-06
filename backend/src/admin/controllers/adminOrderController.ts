import { Request, Response } from "express";
import Order from "../../models/orderModel";
import OrderItem from "../../models/orderItemModel";
import Product from "../../models/productModel";
import AppError from "../../utils/AppError";

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orders = await Order.findAll({
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

  res.status(200).json({
    orders,
  });
};


// Get one order by ID
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const order = await Order.findByPk(id, {
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


export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  // Check that status was provided
  if (!status) {
    throw new AppError("Status is required.", 400);
  }

  // Allowed statuses
  const allowedStatuses = [
    "pending",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid order status.", 400);
  }

  // Find the order
  const order = await Order.findByPk(id);

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // Prevent changing a delivered order
  if (order.status === "delivered") {
    throw new AppError(
      "Delivered orders cannot be changed.",
      400
    );
  }

  // Prevent changing a cancelled order
  if (order.status === "cancelled") {
    throw new AppError(
      "Cancelled orders cannot be changed.",
      400
    );
  }

  // Validate order status flow
  if (
    order.status === "pending" &&
    !["shipped", "cancelled"].includes(status)
  ) {
    throw new AppError(
      "Pending orders can only be shipped or cancelled.",
      400
    );
  }

  if (
    order.status === "shipped" &&
    status !== "delivered"
  ) {
    throw new AppError(
      "Shipped orders can only be delivered.",
      400
    );
  }

  // Restore stock if admin cancels the order
  if (status === "cancelled") {
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
  }

  // Update status
  order.status = status;

  await order.save();

  res.status(200).json({
    message: "Order status updated successfully.",
    order,
  });
};


export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  // Find the order
  const order = await Order.findByPk(id);

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // Only cancelled orders can be deleted
  if (order.status !== "cancelled") {
    throw new AppError(
      "Only cancelled orders can be deleted.",
      400
    );
  }

  // Delete the order items first
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