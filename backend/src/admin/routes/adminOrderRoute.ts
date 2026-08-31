import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";
import { getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from "../controllers/adminOrderController";

const router = Router();

router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllOrders
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getOrderById
);

router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  updateOrderStatus
);


router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteOrder
);
export default router;