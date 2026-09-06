import { Router } from "express";
import {
  getCategories,
  getCategory,
} from "../controllers/categoryController";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get("/", getCategories);


/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get one category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategory);

export default router;