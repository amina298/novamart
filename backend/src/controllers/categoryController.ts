import { Request, Response } from "express";
import Category from "../models/categoryModel";
import AppError from "../utils/AppError";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new AppError("All fields are required.", 400);
  }

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json({
    message: "Category created successfully.",
    category,
  });
};


export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categories = await Category.findAll();

  res.status(200).json({
    categories,
  });
};


export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  res.status(200).json({
    category,
  });
};


export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const { name, description } = req.body;

  if (!name || !description) {
    throw new AppError("All fields are required.", 400);
  }

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  category.name = name;
  category.description = description;

  await category.save();

  res.status(200).json({
    message: "Category updated successfully.",
    category,
  });
};


export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  await category.destroy();

  res.status(200).json({
    message: "Category deleted successfully.",
  });
};