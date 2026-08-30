import { Router } from "express";

import { authenticate } from "../../middleware/auth";

import { requireAdmin } from "../../middleware/authorization";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminProductController";

const router = Router();

router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllProducts
);

router.post(
  "/",
  authenticate,
  requireAdmin,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProduct
);

export default router;