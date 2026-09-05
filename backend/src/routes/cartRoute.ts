import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart  } from "../controllers/cartController";

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the logged-in user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to get cart
 */
router.get(
  "/",
  authenticate,
  getCart
);


/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add a product to the cart
 *     tags:
 *       - Cart
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid product or quantity
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to add product to cart
 */
router.post(
  "/items",
  authenticate,
  addToCart
);


/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Update the quantity of a cart item
 *     tags:
 *       - Cart
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid quantity
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to update cart item
 */
router.put(
  "/items/:id",
  authenticate,
  updateCartItem
);


/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags:
 *       - Cart
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
 *         description: Cart item removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to remove cart item
 */
router.delete(
  "/items/:id",
  authenticate,
  removeCartItem
);


/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear the logged-in user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to clear cart
 */
router.delete(
  "/",
  authenticate,
  clearCart
);
export default router;