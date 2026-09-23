import { Router } from "express";
import { authenticate } from "../middleware/auth";
import validate from "../middleware/validate";
import { idParamSchema } from "../validation/paramValidation";

import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order from the user's cart
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart or product not found
 */
router.post(
  "/",
  authenticate,
  createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticate,
  getOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get one order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get(
  "/:id",
  authenticate,
  validate(idParamSchema, "params"),
  getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel a pending order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Only pending orders can be cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/cancel",
  authenticate,
  validate(idParamSchema, "params"),
  cancelOrder
);

export default router;