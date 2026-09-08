import { Request, Response } from "express";
import Cart from "../models/cartModel";
import Product from "../models/productModel";
import CartItem from "../models/cartItemModel";
import AppError from "../utils/AppError";

export const getCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  res.status(200).json({
    cart,
  });
};

export const addToCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const existingItem = await CartItem.findOne({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        `Not enough stock for ${product.name}.`,
        400
      );
    }

    existingItem.quantity = newQuantity;

    await existingItem.save();

    res.status(200).json({
      message: "Cart updated successfully.",
      cartItem: existingItem,
    });

    return;
  }

  if (quantity > product.stock) {
    throw new AppError(
      `Not enough stock for ${product.name}.`,
      400
    );
  }

  const cartItem = await CartItem.create({
    cartId: cart.id,
    productId,
    quantity,
  });

  res.status(201).json({
    message: "Product added to cart successfully.",
    cartItem,
  });
};

export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const { quantity } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const cartItem = await CartItem.findByPk(id);

  if (!cartItem) {
    throw new AppError("Cart item not found.", 404);
  }

  const product = await Product.findByPk(cartItem.productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (product.stock < quantity) {
    throw new AppError(
      `Not enough stock for ${product.name}.`,
      400
    );
  }

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  if (cartItem.cartId !== cart.id) {
    throw new AppError(
      "You cannot update this cart item.",
      403
    );
  }

  cartItem.quantity = quantity;

  await cartItem.save();

  res.status(200).json({
    message: "Cart item updated successfully.",
    cartItem,
  });
};

export const removeCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const cartItem = await CartItem.findByPk(id);

  if (!cartItem) {
    throw new AppError("Cart item not found.", 404);
  }

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  if (cartItem.cartId !== cart.id) {
    throw new AppError(
      "You cannot remove this cart item.",
      403
    );
  }

  await cartItem.destroy();

  res.status(200).json({
    message: "Cart item removed successfully.",
  });
};

export const clearCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized.", 401);
  }

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  await CartItem.destroy({
    where: {
      cartId: cart.id,
    },
  });

  res.status(200).json({
    message: "Cart cleared successfully.",
  });
};