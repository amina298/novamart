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
  const { name, description, price, stock } = req.body;

  // 1. Validate required fields
  if (!name || !description || price === undefined || stock === undefined) {
    throw new AppError("All fields are required.", 400);
  }

  // 2. Validate price
  if (Number(price) <= 0) {
    throw new AppError("Price must be greater than 0.", 400);
  }

  // 3. Validate stock
  if (Number(stock) < 0) {
    throw new AppError("Stock cannot be negative.", 400);
  }

  // 4. Create the product
  const product = await Product.create({
    name,
    description,
    price,
    stock,
  });

  // 5. Return the created product
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
  const { name, description, price, stock } = req.body;

  // 1. Validate required fields
  if (!name || !description || price === undefined || stock === undefined) {
    throw new AppError("All fields are required.", 400);
  }

  // 2. Validate price
  if (Number(price) <= 0) {
    throw new AppError("Price must be greater than 0.", 400);
  }

  // 3. Validate stock
  if (Number(stock) < 0) {
    throw new AppError("Stock cannot be negative.", 400);
  }

  // 4. Find the product
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  // 5. Update the product
  product.name = name;
  product.description = description;
  product.price = price;
  product.stock = stock;

  await product.save();

  // 6. Return updated product
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

  // 1. Find the product
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  // 2. Check if the product has been used in an order
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

  // 3. Delete the product
  await product.destroy();

  // 4. Return success response
  res.status(200).json({
    message: "Product deleted successfully.",
  });
};