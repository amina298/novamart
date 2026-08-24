import { Router } from "express";
import { createOrder, getOrders } from "../controllers/orderController";
import { authenticate } from "../middleware/auth";
const router = Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);

export default router;