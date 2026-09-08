import { Router } from "express";

import {
  registerUser,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/User";

import { authenticate } from "../middleware/auth";
import validate from "../middleware/validate";
import { registerUserSchema, updateProfileSchema } from "../validation/userValidation";

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
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
 *               - password
 *               - phone
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
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               phone:
 *                 type: string
 *                 example: "+254724440076"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: All fields are required
 *       409:
 *         description: Email already exists
 */
router.post("/register",  validate(registerUserSchema), registerUser);


/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/profile",
  authenticate,
  getProfile
);


/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the logged-in user's profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Amina
 *               lastName:
 *                 type: string
 *                 example: Jama
 *               phone:
 *                 type: string
 *                 example: "+254724440076"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: All fields are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  "/profile",
  authenticate,
   validate(updateProfileSchema),
  updateProfile
);


/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Delete the logged-in user's profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete(
  "/profile",
  authenticate,
  deleteProfile
);

export default router;