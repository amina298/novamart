import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController";

const router = Router();

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add a product to my wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *       400:
 *         description: Product is already in wishlist or product ID is missing
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to add product to wishlist
 */
router.post(
  "/",
  authenticate,
  addToWishlist
);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get my wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to get wishlist
 */
router.get(
  "/",
  authenticate,
  getMyWishlist
);

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Remove an item from my wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only remove items from your own wishlist
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Failed to remove product from wishlist
 */
router.delete(
  "/:id",
  authenticate,
  removeFromWishlist
);

export default router;