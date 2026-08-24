import { Request, Response } from "express";
import Cart from "../models/cartModel";
import Product from "../models/productModel";
import CartItem from "../models/cartItemModel";

export const getCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    res.status(404).json({
      message: "Cart not found.",
    });

    return;
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

  if (!productId || !quantity) {
    res.status(400).json({
      message: "Product ID and quantity are required.",
    });

    return;
  }

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    res.status(404).json({
      message: "Cart not found.",
    });

    return;
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    res.status(404).json({
      message: "Product not found.",
    });

    return;
  }

  const existingItem = await CartItem.findOne({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    existingItem.quantity += quantity;

    await existingItem.save();

    res.status(200).json({
      message: "Cart updated successfully.",
      cartItem: existingItem,
    });

    return;
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

  if (!quantity || quantity < 1) {
    res.status(400).json({
      message: "Quantity must be at least 1.",
    });

    return;
  }

  const cartItem = await CartItem.findByPk(id);

  if (!cartItem) {
    res.status(404).json({
      message: "Cart item not found.",
    });

    return;
  }

  const userId = req.user?.id;

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    res.status(404).json({
      message: "Cart not found.",
    });

    return;
  }

  if (cartItem.cartId !== cart.id) {
    res.status(403).json({
      message: "You cannot update this cart item.",
    });

    return;
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

  const cartItem = await CartItem.findByPk(id);

  if (!cartItem) {
    res.status(404).json({
      message: "Cart item not found.",
    });

    return;
  }

  const userId = req.user?.id;

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    res.status(404).json({
      message: "Cart not found.",
    });

    return;
  }

  if (cartItem.cartId !== cart.id) {
    res.status(403).json({
      message: "You cannot remove this cart item.",
    });

    return;
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

  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    res.status(404).json({
      message: "Cart not found.",
    });

    return;
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