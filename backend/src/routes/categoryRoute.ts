import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/authorization";
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from "../controllers/categoryController";

const router = Router();

router.post(
  "/",
  authenticate,
  requireAdmin,
  createCategory
);

router.get(
  "/",
  authenticate,
  requireAdmin,
  getCategories
);


router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getCategory
);


router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateCategory
);



router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteCategory
);

export default router;