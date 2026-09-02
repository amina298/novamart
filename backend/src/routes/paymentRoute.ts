import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createPayment, getMyPayments, getMyPaymentById } from "../controllers/paymentController";

const router = Router();

router.post(
  "/",
  authenticate,
  createPayment
);


router.get(
  "/",
  authenticate,
  getMyPayments
);

router.get(
  "/:id",
  authenticate,
  getMyPaymentById
);
export default router;