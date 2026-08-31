import { Request, Response } from "express";
import Order from "../../models/orderModel";
import OrderItem from "../../models/orderItemModel";
import Product from "../../models/productModel";

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      message: "Failed to get all orders.",
    });
  }
};


// Get one order by ID
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  try {
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
      res.status(404).json({
        message: "Order not found.",
      });

      return;
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Get admin order error:", error);

    res.status(500).json({
      message: "Failed to get order.",
    });
  }
};


export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  // 1. Check that status was provided
  if (!status) {
    res.status(400).json({
      message: "Status is required.",
    });

    return;
  }

  // 2. Allowed statuses
  const allowedStatuses = [
    "pending",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    res.status(400).json({
      message: "Invalid order status.",
    });

    return;
  }

  try {
    // 3. Find the order
    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({
        message: "Order not found.",
      });

      return;
    }

    // 4. Prevent changing a delivered order
    if (order.status === "delivered") {
      res.status(400).json({
        message: "Delivered orders cannot be changed.",
      });

      return;
    }

    // 5. Prevent changing a cancelled order
    if (order.status === "cancelled") {
      res.status(400).json({
        message: "Cancelled orders cannot be changed.",
      });

      return;
    }

    // 6. Validate order status flow
    if (
      order.status === "pending" &&
      !["shipped", "cancelled"].includes(status)
    ) {
      res.status(400).json({
        message: "Pending orders can only be shipped or cancelled.",
      });

      return;
    }

    if (order.status === "shipped" && status !== "delivered") {
      res.status(400).json({
        message: "Shipped orders can only be delivered.",
      });

      return;
    }

    // 7. Restore stock if admin cancels the order
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

    // 8. Update status
    order.status = status;

    await order.save();

    // 9. Return updated order
    res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Admin update order status error:", error);

    res.status(500).json({
      message: "Failed to update order status.",
    });
  }
};


export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  try {
    // 1. Find the order
    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({
        message: "Order not found.",
      });

      return;
    }

    // 2. Only cancelled orders can be deleted
    if (order.status !== "cancelled") {
      res.status(400).json({
        message: "Only cancelled orders can be deleted.",
      });

      return;
    }

    // 3. Delete the order items first
    await OrderItem.destroy({
      where: {
        orderId: order.id,
      },
    });

    // 4. Delete the order
    await order.destroy();

    // 5. Return success
    res.status(200).json({
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete order error:", error);

    res.status(500).json({
      message: "Failed to delete order.",
    });
  }
};