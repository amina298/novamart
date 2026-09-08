import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z
    .number()
    .int("Product ID must be an integer.")
    .positive("Product ID must be a positive number."),

  rating: z
    .number()
    .int("Rating must be an integer.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must not exceed 5."),

  comment: z
    .string()
    .min(1, "Comment is required."),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must not exceed 5."),

  comment: z
    .string()
    .min(1, "Comment is required."),
});