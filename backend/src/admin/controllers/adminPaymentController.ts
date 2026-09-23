import { Request, Response } from "express";
import Payment from "../../models/paymentModel";
import Order from "../../models/orderModel";
import AppError from "../../utils/AppError";

/**
 * Get all payments
 * Admin only
 */
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
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    payments,
  });
};

/**
 * Get one payment
 * Admin only
 */
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

/**
 * Update payment status
 * Admin only
 */
export const updatePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  const payment = await Payment.findByPk(id);

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  const order = await Order.findByPk(payment.orderId);

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  /*
   * A paid payment is final in the current system.
   *
   * We do not allow:
   * paid → pending
   * paid → failed
   * paid → paid
   */
  if (payment.status === "paid") {
    throw new AppError(
      "Paid payments cannot be changed.",
      400
    );
  }

  /*
   * Do not allow a cancelled order to become paid.
   */
  if (
    order.status === "cancelled" &&
    status === "paid"
  ) {
    throw new AppError(
      "Payment cannot be marked as paid because the order is cancelled.",
      400
    );
  }

  /*
   * A failed payment can only be recovered
   * by marking it as paid.
   *
   * It cannot go back to pending.
   */
  if (
    payment.status === "failed" &&
    status !== "paid"
  ) {
    throw new AppError(
      "Failed payments can only be marked as paid.",
      400
    );
  }

  /*
   * A pending payment cannot remain pending.
   */
  if (
    payment.status === "pending" &&
    status === "pending"
  ) {
    throw new AppError(
      "Payment is already pending.",
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