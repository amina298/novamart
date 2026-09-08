import { Request, Response } from "express";
import Category from "../../models/categoryModel";
import AppError from "../../utils/AppError";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categories = await Category.findAll();

  res.status(200).json({
    categories,
  });
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  res.status(200).json({
    category,
  });
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description } = req.body;

  const existingCategory = await Category.findOne({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new AppError("Category already exists.", 409);
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

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const { name, description } = req.body;

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  const existingCategory = await Category.findOne({
    where: {
      name,
    },
  });

  if (existingCategory && existingCategory.id !== category.id) {
    throw new AppError("Category name already exists.", 409);
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
  const id = req.params.id as string;

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  await category.destroy();

  res.status(200).json({
    message: "Category deleted successfully.",
  });
};