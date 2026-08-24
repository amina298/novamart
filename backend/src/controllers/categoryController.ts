import { Request, Response } from "express";
import Category from "../models/categoryModel";

export const createCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, description } = req.body;


    if (!name || !description) {
        res.status(400).json({
            message: "All fields are required.",
        });

        return;
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
    res.status(404).json({
      message: "Category not found.",
    });

    return;
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
    res.status(400).json({
      message: "All fields are required.",
    });

    return;
  }

  const category = await Category.findByPk(id);

  if (!category) {
    res.status(404).json({
      message: "Category not found.",
    });

    return;
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
    res.status(404).json({
      message: "Category not found.",
    });

    return;
  }

  await category.destroy();

  res.status(200).json({
    message: "Category deleted successfully.",
  });
};