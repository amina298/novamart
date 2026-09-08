import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required."),

  description: z
    .string()
    .min(1, "Product description is required."),

  price: z
    .number()
    .positive("Price must be greater than 0."),

  stock: z
    .number()
    .int("Stock must be an integer.")
    .min(0, "Stock cannot be negative."),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required."),

  description: z
    .string()
    .min(1, "Product description is required."),

  price: z
    .number()
    .positive("Price must be greater than 0."),

  stock: z
    .number()
    .int("Stock must be an integer.")
    .min(0, "Stock cannot be negative."),
});