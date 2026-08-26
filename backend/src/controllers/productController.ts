import { Request, Response } from "express";
import Product from "../models/productModel";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, price, stock } = req.body;


  if (!name || !description || price === undefined || stock === undefined) {
    res.status(400).json({
      message: "All fields are required.",
    });

    return;
  }

  if (price <= 0) {
    res.status(400).json({
      message: "Price must be greater than 0.",
    });

    return;
  }

  if (stock < 0) {
    res.status(400).json({
      message: "Stock cannot be negative.",
    });

    return;
  }

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
  // 1. Get the product ID from the URL
    const id = Number(req.params.id);

  // 2. Get the new product information from the request body
  const { name, description, price, stock } = req.body;

  // 3. Validate the fields

if (!name || !description || price === undefined || stock === undefined) {
  res.status(400).json({
    message: "All fields are required.",
  });

  return;
}

if (price <= 0) {
  res.status(400).json({
    message: "Price must be greater than 0.",
  });

  return;
}

if (stock < 0) {
  res.status(400).json({
    message: "Stock cannot be negative.",
  });

  return;
}

  // 4. Find the product in the database
  const product = await Product.findByPk(id);

  // 5. Check if the product exists
  if (!product) {
    res.status(404).json({
      message: "Product not found.",
    });

    return;
  }

  // 6. Update the product in memory
  product.name = name;
  product.description = description;
  product.price = price;
  product.stock = stock;

  // 7. Save the changes to the database
  await product.save();

  // 8. Send the response
  res.status(200).json({
    message: "Product updated successfully.",
    product,
  });
};


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
    res.status(404).json({
      message: "Product not found.",
    });

    return;
  }

  res.status(200).json({
    product,
  });
};



export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({
      message: "Product not found.",
    });

    return;
  }

  await product.destroy();

  res.status(200).json({
    message: "Product deleted successfully.",
  });
};

