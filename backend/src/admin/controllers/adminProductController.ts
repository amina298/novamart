import { Request, Response } from "express";
import Product from "../../models/productModel";
import OrderItem from "../../models/orderItemModel";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.findAll();

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get all products error:", error);

    res.status(500).json({
      message: "Failed to get all products.",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, price, stock } = req.body;

  // 1. Validate required fields
  if (!name || !description || price === undefined || stock === undefined) {
    res.status(400).json({
      message: "All fields are required.",
    });

    return;
  }

  // 2. Validate price
  if (Number(price) <= 0) {
    res.status(400).json({
      message: "Price must be greater than 0.",
    });

    return;
  }

  // 3. Validate stock
  if (Number(stock) < 0) {
    res.status(400).json({
      message: "Stock cannot be negative.",
    });

    return;
  }

  try {
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
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product.",
    });
  }
};


export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { name, description, price, stock } = req.body;

  // 1. Validate required fields
  if (!name || !description || price === undefined || stock === undefined) {
    res.status(400).json({
      message: "All fields are required.",
    });

    return;
  }

  // 2. Validate price
  if (Number(price) <= 0) {
    res.status(400).json({
      message: "Price must be greater than 0.",
    });

    return;
  }

  // 3. Validate stock
  if (Number(stock) < 0) {
    res.status(400).json({
      message: "Stock cannot be negative.",
    });

    return;
  }

  try {
    // 4. Find the product
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        message: "Product not found.",
      });

      return;
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
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product.",
    });
  }
};

 
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  try {
    // 1. Find the product
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        message: "Product not found.",
      });

      return;
    }

    // 2. Check if the product has been used in an order
    const orderItem = await OrderItem.findOne({
      where: {
        productId: id,
      },
    });

    if (orderItem) {
      res.status(400).json({
        message: "Cannot delete a product that has been ordered.",
      });

      return;
    }

    // 3. Delete the product
    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product.",
    });
  }
};