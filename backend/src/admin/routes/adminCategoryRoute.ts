import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";
import validate from "../../middleware/validate";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../../validation/adminCategoryValidation";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminCategoryController";

const router = Router();

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllCategories
);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getCategoryById
);

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphones
 *               description:
 *                 type: string
 *                 example: Mobile phones and smartphones
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid category data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Category already exists
 */
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createCategorySchema),
  createCategory
);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Electronic devices and accessories
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid category data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name already exists
 */
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateCategorySchema),
  updateCategory
);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Admin Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteCategory
);

export default router;