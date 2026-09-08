import { Request, Response } from "express";
import Category from "../models/categoryModel";
import AppError from "../utils/AppError";

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