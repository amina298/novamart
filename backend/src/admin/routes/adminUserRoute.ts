import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/authorization";

import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/adminUserController";

const router = Router();

router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllUsers
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getUserById
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateUser
);


router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteUser
);

export default router;