import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";

const router = Router();

router.post(
  "/",
  authenticate,
  createReview
);

router.get(
  "/product/:productId",
  getProductReviews
);

router.put(
  "/:id",
  authenticate,
  updateReview
);

router.delete(
  "/:id",
  authenticate,
  deleteReview
);

export default router;