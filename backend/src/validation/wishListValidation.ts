import { z } from "zod";

export const addToWishlistSchema = z.object({
  productId: z
    .number()
    .int("Product ID must be an integer.")
    .positive("Product ID must be a positive number."),
});
