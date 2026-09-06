import { Request, Response } from "express";
import Payment from "../../models/paymentModel";
import Order from "../../models/orderModel";
import AppError from "../../utils/AppError";

export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const payments = await Payment.findAll({
    include: [
      {
        model: Order,
      },
    ],
  });

  res.status(200).json({
    payments,
  });
};


export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const payment = await Payment.findByPk(id, {
    include: [
      {
        model: Order,
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


export const updatePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  // Validate required field
  if (!status) {
    throw new AppError("Payment status is required.", 400);
  }

  // Validate payment status
  const allowedStatuses = ["pending", "paid", "failed"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid payment status.", 400);
  }

  const payment = await Payment.findByPk(id);

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  // Paid payments cannot be changed
  if (payment.status === "paid") {
    throw new AppError(
      "Paid payments cannot be changed.",
      400
    );
  }

  // Failed payments can only be marked as paid
  if (payment.status === "failed" && status !== "paid") {
    throw new AppError(
      "Failed payments can only be marked as paid.",
      400
    );
  }

  payment.status = status;

  await payment.save();

  res.status(200).json({
    message: "Payment status updated successfully.",
    payment,
  });
};