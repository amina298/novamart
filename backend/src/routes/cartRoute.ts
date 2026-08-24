import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart  } from "../controllers/cartController";

const router = Router();

router.get(
  "/",
  authenticate,
  getCart
);


router.post(
  "/items",
  authenticate,
  addToCart
);


router.put(
  "/items/:id",
  authenticate,
  updateCartItem
);


router.delete(
  "/items/:id",
  authenticate,
  removeCartItem
);


router.delete(
  "/",
  authenticate,
  clearCart
);
export default router;