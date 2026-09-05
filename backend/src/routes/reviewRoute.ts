import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";

const router = Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a product review
 *     tags:
 *       - Reviews
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
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 2
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great product. I really like it.
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid review data or product already reviewed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to create review
 */
router.post(
  "/",
  authenticate,
  createReview
);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get reviews for a product
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Product reviews retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to get product reviews
 */
router.get(
  "/product/:productId",
  getProductReviews
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update my product review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Good product, but delivery was slow.
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid review data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only update your own review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Failed to update review
 */
router.put(
  "/:id", authenticate, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete my product review
 *     tags:
 *       - Reviews
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
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only delete your own review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Failed to delete review
 */
router.delete("/:id", authenticate, deleteReview);

export default router;