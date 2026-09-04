import { Request, Response } from "express";
import Wishlist from "../models/wishlistModel";
import Product from "../models/productModel";

export const addToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { productId } = req.body;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  if (!productId) {
    res.status(400).json({
      message: "Product ID is required.",
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

    const existingWishlist = await Wishlist.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingWishlist) {
      res.status(400).json({
        message: "Product is already in your wishlist.",
      });
      return;
    }

    const wishlist = await Wishlist.create({
      userId,
      productId,
    });

    res.status(201).json({
      message: "Product added to wishlist.",
      wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);

    res.status(500).json({
      message: "Failed to add product to wishlist.",
    });
  }
};


export const getMyWishlist = async (
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

  try {
    const wishlist = await Wishlist.findAll({
      where: {
        userId,
      },
    });

    res.status(200).json({
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      message: "Failed to get wishlist.",
    });
  }
};



export const removeFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const wishlistId = req.params.id as string;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    const wishlist = await Wishlist.findByPk(wishlistId);

    if (!wishlist) {
      res.status(404).json({
        message: "Wishlist item not found.",
      });
      return;
    }

    if (wishlist.userId !== userId) {
      res.status(403).json({
        message: "You can only remove items from your own wishlist.",
      });
      return;
    }

    await wishlist.destroy();

    res.status(200).json({
      message: "Product removed from wishlist.",
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);

    res.status(500).json({
      message: "Failed to remove product from wishlist.",
    });
  }
};