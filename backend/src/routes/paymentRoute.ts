import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createPayment, getMyPayments, getMyPaymentById } from "../controllers/paymentController";

const router = Router();

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a payment for an order
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentMethod
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 7
 *               paymentMethod:
 *                 type: string
 *                 example: mpesa
 *               transactionId:
 *                 type: string
 *                 example: MPESA123456
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid payment data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to create payment
 */
router.post(
  "/",
  authenticate,
  createPayment
);


/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get my payments
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to get payments
 */
router.get(
  "/",
  authenticate,
  getMyPayments
);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get one of my payments by ID
 *     tags:
 *       - Payments
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
 *         description: Payment retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Failed to get payment
 */
router.get(
  "/:id",
  authenticate,
  getMyPaymentById
);
export default router;