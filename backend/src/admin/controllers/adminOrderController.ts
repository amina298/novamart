import { Request, Response } from "express";
import Order from "../../models/orderModel";
import OrderItem from "../../models/orderItemModel";
import Product from "../../models/productModel";
import Payment from "../../models/paymentModel";
import AppError from "../../utils/AppError";

/**
 * Get all orders
 * Admin only
 */
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
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    orders,
  });
};

/**
 * Get one order
 * Admin only
 */
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

/**
 * Update order status
 * Admin only
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  const order = await Order.findByPk(id);

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  /*
   * Delivered orders are final.
   */
  if (order.status === "delivered") {
    throw new AppError(
      "Delivered orders cannot be changed.",
      400
    );
  }

  /*
   * Cancelled orders are final.
   */
  if (order.status === "cancelled") {
    throw new AppError(
      "Cancelled orders cannot be changed.",
      400
    );
  }

  /*
   * Prevent unnecessary status changes.
   */
  if (order.status === status) {
    throw new AppError(
      `Order is already ${status}.`,
      400
    );
  }

  /*
   * PENDING ORDER
   *
   * Allowed:
   * pending → shipped
   * pending → cancelled
   */
  if (order.status === "pending") {
    if (!["shipped", "cancelled"].includes(status)) {
      throw new AppError(
        "A pending order can only be shipped or cancelled.",
        400
      );
    }

    /*
     * An order cannot be shipped until its payment
     * has been successfully completed.
     */
    if (status === "shipped") {
      const payment = await Payment.findOne({
        where: {
          orderId: order.id,
        },
      });

      if (!payment) {
        throw new AppError(
          "Order cannot be shipped because no payment exists.",
          400
        );
      }

      if (payment.status !== "paid") {
        throw new AppError(
          "Order cannot be shipped until payment is completed.",
          400
        );
      }
    }

    /*
     * Cancelling a pending order is allowed only when
     * the payment has not already been completed.
     */
    if (status === "cancelled") {
      const payment = await Payment.findOne({
        where: {
          orderId: order.id,
        },
      });

      if (payment?.status === "paid") {
        throw new AppError(
          "Paid orders cannot be cancelled. Please process a refund before cancelling the order.",
          400
        );
      }

      /*
       * Restore the stock reserved when the order
       * was created.
       */
      const orderItems = await OrderItem.findAll({
        where: {
          orderId: order.id,
        },
      });

      for (const item of orderItems) {
        const product = await Product.findByPk(
          item.productId
        );

        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
  }

  /*
   * SHIPPED ORDER
   *
   * Only:
   * shipped → delivered
   */
  if (order.status === "shipped") {
    if (status !== "delivered") {
      throw new AppError(
        "A shipped order can only be marked as delivered.",
        400
      );
    }
  }

  order.status = status;

  await order.save();

  res.status(200).json({
    message: "Order status updated successfully.",
    order,
  });
};

/**
 * Delete an order
 * Admin only
 *
 * Only cancelled orders can be permanently deleted.
 */
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const order = await Order.findByPk(id);

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  if (order.status !== "cancelled") {
    throw new AppError(
      "Only cancelled orders can be deleted.",
      400
    );
  }

  await OrderItem.destroy({
    where: {
      orderId: order.id,
    },
  });

  await order.destroy();

  res.status(200).json({
    message: "Order deleted successfully.",
  });
};