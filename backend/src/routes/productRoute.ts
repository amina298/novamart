import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/authorization";

import {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

// CREATE
router.post(
  "/",
  authenticate,
  requireAdmin,
  createProduct
);

// GET ALL
router.get(
  "/",
  authenticate,
  requireAdmin,
  getProducts
);

// GET ONE
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getProduct
);

// UPDATE
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateProduct
);

// DELETE
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProduct
);

export default router;