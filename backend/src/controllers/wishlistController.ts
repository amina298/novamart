import { Request, Response } from "express";
import Wishlist from "../models/wishlistModel";
import Product from "../models/productModel";
import AppError from "../utils/AppError";

export const addToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { productId } = req.body;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  if (!productId) {
    throw new AppError("Product ID is required.", 400);
  }

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const existingWishlist = await Wishlist.findOne({
    where: {
      userId,
      productId,
    },
  });

  if (existingWishlist) {
    throw new AppError(
      "Product is already in your wishlist.",
      400
    );
  }

  const wishlist = await Wishlist.create({
    userId,
    productId,
  });

  res.status(201).json({
    message: "Product added to wishlist.",
    wishlist,
  });
};


export const getMyWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const wishlist = await Wishlist.findAll({
    where: {
      userId,
    },
  });

  res.status(200).json({
    wishlist,
  });
};


export const removeFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const wishlistId = req.params.id as string;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const wishlist = await Wishlist.findByPk(wishlistId);

  if (!wishlist) {
    throw new AppError("Wishlist item not found.", 404);
  }

  if (wishlist.userId !== userId) {
    throw new AppError(
      "You can only remove items from your own wishlist.",
      403
    );
  }

  await wishlist.destroy();

  res.status(200).json({
    message: "Product removed from wishlist.",
  });
};