import { Request, Response } from "express";
import Payment from "../models/paymentModel";
import Order from "../models/orderModel";
import AppError from "../utils/AppError";

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { orderId, paymentMethod } = req.body;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  if (order.userId !== userId) {
    throw new AppError(
      "You cannot pay for this order.",
      403
    );
  }

  if (order.status === "cancelled") {
    throw new AppError(
      "Cancelled orders cannot be paid.",
      400
    );
  }

  const existingPayment = await Payment.findOne({
    where: {
      orderId: order.id,
    },
  });

  if (existingPayment) {
    throw new AppError(
      "Payment already exists for this order.",
      400
    );
  }

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
};

export const getMyPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

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
};

export const getMyPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const id = req.params.id as string;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

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
    throw new AppError("Payment not found.", 404);
  }

  res.status(200).json({
    payment,
  });
};