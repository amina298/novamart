import { z } from "zod";

export const updatePaymentStatusSchema = z.object({
  status: z.enum(
    ["pending", "paid", "failed"],
    {
      message: "Payment status must be pending, paid, or failed.",
    }
  ),
});