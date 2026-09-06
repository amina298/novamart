import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";

import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/adminOrderController";

const router = Router();

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllOrders
);


/**
 * @swagger
 * /api/admin/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getOrderById
);


/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *         example: 7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - shipped
 *                   - delivered
 *                   - cancelled
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order status or order cannot be updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  updateOrderStatus
);


/**
 * @swagger
 * /api/admin/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       400:
 *         description: Order cannot be deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteOrder
);

export default router;