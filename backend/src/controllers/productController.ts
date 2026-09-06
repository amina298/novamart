import { Request, Response } from "express";
import Product from "../models/productModel";
import AppError from "../utils/AppError";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await Product.findAll();

  res.status(200).json({
    products,
  });
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  res.status(200).json({
    product,
  });
};