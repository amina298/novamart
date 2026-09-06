import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController";

const router = Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllUsers
);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getUserById
);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Amina
 *               lastName:
 *                 type: string
 *                 example: Jama
 *               email:
 *                 type: string
 *                 format: email
 *                 example: amina@example.com
 *               phone:
 *                 type: string
 *                 example: "+254724440076"
 *               role:
 *                 type: string
 *                 enum:
 *                   - customer
 *                   - admin
 *                 example: customer
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid user data or role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateUser
);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User cannot be deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteUser
);

export default router;