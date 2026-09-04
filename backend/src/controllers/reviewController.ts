import { Request, Response } from "express";
import Review from "../models/reviewModel";
import Product from "../models/productModel";

export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    res.status(400).json({
      message: "Product ID, rating, and comment are required.",
    });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({
      message: "Rating must be between 1 and 5.",
    });
    return;
  }

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({
        message: "Product not found.",
      });
      return;
    }

    const existingReview = await Review.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      res.status(400).json({
        message: "You have already reviewed this product.",
      });
      return;
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
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      message: "Failed to create review.",
    });
  }
};


export const getProductReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.productId as string;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({
        message: "Product not found.",
      });
      return;
    }

    const reviews = await Review.findAll({
      where: {
        productId,
      },
    });

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);

    res.status(500).json({
      message: "Failed to get product reviews.",
    });
  }
};

export const updateReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const reviewId = req.params.id as string;
  const { rating, comment } = req.body;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  if (!rating || !comment) {
    res.status(400).json({
      message: "Rating and comment are required.",
    });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({
      message: "Rating must be between 1 and 5.",
    });
    return;
  }

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      res.status(404).json({
        message: "Review not found.",
      });
      return;
    }

    if (review.userId !== userId) {
      res.status(403).json({
        message: "You can only update your own review.",
      });
      return;
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);

    res.status(500).json({
      message: "Failed to update review.",
    });
  }
};


export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const reviewId = req.params.id as string;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      res.status(404).json({
        message: "Review not found.",
      });
      return;
    }

    if (review.userId !== userId) {
      res.status(403).json({
        message: "You can only delete your own review.",
      });
      return;
    }

    await review.destroy();

    res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    res.status(500).json({
      message: "Failed to delete review.",
    });
  }
};