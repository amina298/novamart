import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController";

const router = Router();

router.post(
  "/",
  authenticate,
  addToWishlist
);

router.get(
  "/",
  authenticate,
  getMyWishlist
);

router.delete(
  "/:id",
  authenticate,
  removeFromWishlist
);

export default router;