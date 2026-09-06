import { Request, Response } from "express";
import Review from "../models/reviewModel";
import Product from "../models/productModel";
import AppError from "../utils/AppError";

export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    throw new AppError(
      "Product ID, rating, and comment are required.",
      400
    );
  }

  if (rating < 1 || rating > 5) {
    throw new AppError(
      "Rating must be between 1 and 5.",
      400
    );
  }

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const existingReview = await Review.findOne({
    where: {
      userId,
      productId,
    },
  });

  if (existingReview) {
    throw new AppError(
      "You have already reviewed this product.",
      400
    );
  }

  const review = await Review.create({
    userId,
    productId,
    rating,
    comment,
  });

  res.status(201).json({
    message: "Review created successfully.",
    review,
  });
};


export const getProductReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.productId as string;

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const reviews = await Review.findAll({
    where: {
      productId,
    },
  });

  res.status(200).json({
    reviews,
  });
};


export const updateReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const reviewId = req.params.id as string;
  const { rating, comment } = req.body;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  if (!rating || !comment) {
    throw new AppError(
      "Rating and comment are required.",
      400
    );
  }

  if (rating < 1 || rating > 5) {
    throw new AppError(
      "Rating must be between 1 and 5.",
      400
    );
  }

  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  if (review.userId !== userId) {
    throw new AppError(
      "You can only update your own review.",
      403
    );
  }

  review.rating = rating;
  review.comment = comment;

  await review.save();

  res.status(200).json({
    message: "Review updated successfully.",
    review,
  });
};


export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const reviewId = req.params.id as string;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  if (review.userId !== userId) {
    throw new AppError(
      "You can only delete your own review.",
      403
    );
  }

  await review.destroy();

  res.status(200).json({
    message: "Review deleted successfully.",
  });
};