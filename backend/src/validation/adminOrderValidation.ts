import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum(
    ["pending", "shipped", "delivered", "cancelled"],
    {
      message:
        "Order status must be pending, shipped, delivered, or cancelled.",
    }
  ),
});