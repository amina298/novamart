import { z } from "zod";

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a valid number."),
});

export const productIdParamSchema = z.object({
  productId: z
    .string()
    .regex(/^\d+$/, "Product ID must be a valid number."),
});