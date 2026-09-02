import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";
import {
  getAllPayments,
    getPaymentById,
  updatePaymentStatus
} from "../controllers/adminPaymentController";

const router = Router();

router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllPayments
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getPaymentById
);

router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  updatePaymentStatus
);

export default router;