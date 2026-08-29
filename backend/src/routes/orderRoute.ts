import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/authorization";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  cancelOrder
} from "../controllers/orderController";

const router = Router();

// Create an order / checkout
router.post("/", authenticate, createOrder);

// Get all orders for the logged-in user
router.get("/", authenticate, getOrders);

// Get one order by ID
router.get("/:id", authenticate, getOrderById);

// Update an order
router.put("/:id", authenticate, requireAdmin, updateOrder);

// Delete an order
router.delete("/:id", authenticate, deleteOrder);

router.patch("/:id/cancel", authenticate, cancelOrder);

export default router;