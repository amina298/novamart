import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";
import { getAllOrders } from "../controllers/adminOrderController";

const router = Router();

router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllOrders
);

export default router;