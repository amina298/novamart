import { Request, Response } from "express";
import Payment from "../models/paymentModel";
import Order from "../models/orderModel";

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { orderId, paymentMethod } = req.body;

  // Check authentication
  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  // Validate required fields
  if (!orderId || !paymentMethod) {
    res.status(400).json({
      message: "Order ID and payment method are required.",
    });
    return;
  }

  // Validate payment method
  const allowedMethods = ["mpesa", "card", "cash"];

  if (!allowedMethods.includes(paymentMethod)) {
    res.status(400).json({
      message: "Invalid payment method.",
    });
    return;
  }

  try {
    // Find the order
    const order = await Order.findByPk(orderId);

    if (!order) {
      res.status(404).json({
        message: "Order not found.",
      });
      return;
    }

    // Make sure the order belongs to the logged-in user
    if (order.userId !== userId) {
      res.status(403).json({
        message: "You cannot pay for this order.",
      });
      return;
    }

    // Cancelled orders cannot be paid
    if (order.status === "cancelled") {
      res.status(400).json({
        message: "Cancelled orders cannot be paid.",
      });
      return;
    }

    // Check if the order already has a payment
    const existingPayment = await Payment.findOne({
      where: {
        orderId: order.id,
      },
    });

    if (existingPayment) {
      res.status(400).json({
        message: "Payment already exists for this order.",
      });
      return;
    }

    // Create payment using the order total
    const payment = await Payment.create({
      orderId: order.id,
      amount: order.total,
      paymentMethod,
      status: "pending",
    });

    res.status(201).json({
      message: "Payment created successfully.",
      payment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    res.status(500).json({
      message: "Failed to create payment.",
    });
  }
};


export const getMyPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Order,
          where: {
            userId,
          },
        },
      ],
    });

    res.status(200).json({
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      message: "Failed to get payments.",
    });
  }
};


export const getMyPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const id = req.params.id as string;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
          where: {
            userId,
          },
        },
      ],
    });

    if (!payment) {
      res.status(404).json({
        message: "Payment not found.",
      });
      return;
    }

    res.status(200).json({
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);

    res.status(500).json({
      message: "Failed to get payment.",
    });
  }
};