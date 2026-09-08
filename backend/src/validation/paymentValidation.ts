import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z.number().int().positive(
    "Order ID must be a positive number."
  ),

  paymentMethod: z.enum(
    ["mpesa", "card"],
    {
      message: "Payment method must be mpesa or card.",
    }
  ),
});