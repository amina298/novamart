import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive number."),
  quantity: z.number().int().positive("Quantity must be at least 1."),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1."),
});