import { Router } from "express";
import { registerUser, getProfile, updateProfile, deleteProfile } from "../controllers/User";
import { authenticate } from "../middleware/auth";

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
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data or email already exists
 *       500:
 *         description: Failed to register user
 */
router.post("/register", registerUser);
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
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to get user profile
 */
router.get("/profile", authenticate, getProfile);
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
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update profile
 */
router.put("/profile", authenticate, updateProfile);
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
 *       500:
 *         description: Failed to delete profile
 */
router.delete("/profile", authenticate, deleteProfile);
export default router;