import { Request, Response } from "express";
import Product from "../../models/productModel";
import OrderItem from "../../models/orderItemModel";
import AppError from "../../utils/AppError";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await Product.findAll();

  res.status(200).json({
    products,
  });
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    description,
    price,
    stock,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    stock,
  });

  res.status(201).json({
    message: "Product created successfully.",
    product,
  });
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const {
    name,
    description,
    price,
    stock,
  } = req.body;

  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.stock = stock;

  await product.save();

  res.status(200).json({
    message: "Product updated successfully.",
    product,
  });
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const orderItem = await OrderItem.findOne({
    where: {
      productId: id,
    },
  });

  if (orderItem) {
    throw new AppError(
      "Cannot delete a product that has been ordered.",
      400
    );
  }

  await product.destroy();

  res.status(200).json({
    message: "Product deleted successfully.",
  });
};