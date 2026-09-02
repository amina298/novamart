import { Request, Response } from "express";
import Payment from "../../models/paymentModel";
import Order from "../../models/orderModel";

export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
  } catch (error) {
    console.error("Get all payments error:", error);

    res.status(500).json({
      message: "Failed to get payments.",
    });
  }
};


export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  try {
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
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


export const updatePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({
      message: "Payment status is required.",
    });
    return;
  }

  const allowedStatuses = ["pending", "paid", "failed"];

  if (!allowedStatuses.includes(status)) {
    res.status(400).json({
      message: "Invalid payment status.",
    });
    return;
  }

  try {
    const payment = await Payment.findByPk(id);

    if (!payment) {
      res.status(404).json({
        message: "Payment not found.",
      });
      return;
    }

    if (payment.status === "paid") {
      res.status(400).json({
        message: "Paid payments cannot be changed.",
      });
      return;
    }

    if (payment.status === "failed" && status !== "paid") {
      res.status(400).json({
        message: "Failed payments can only be marked as paid.",
      });
      return;
    }

    payment.status = status;

    await payment.save();

    res.status(200).json({
      message: "Payment status updated successfully.",
      payment,
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    res.status(500).json({
      message: "Failed to update payment status.",
    });
  }
};