import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";
import validate from "../../middleware/validate";

import { idParamSchema } from "../../validation/paramValidation";
import { updatePaymentStatusSchema } from "../../validation/adminPaymentValidation";

import {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
} from "../controllers/adminPaymentController";

const router = Router();

/**
 * @swagger
 * /api/admin/payments:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Admin Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllPayments
);

/**
 * @swagger
 * /api/admin/payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags:
 *       - Admin Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       400:
 *         description: Invalid payment ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Payment not found
 */
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  getPaymentById
);

/**
 * @swagger
 * /api/admin/payments/{id}/status:
 *   put:
 *     summary: Update payment status
 *     tags:
 *       - Admin Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - paid
 *                   - failed
 *                 example: paid
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       400:
 *         description: Invalid payment status or status change
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Payment not found
 */
router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updatePaymentStatusSchema),
  updatePaymentStatus
);

export default router;