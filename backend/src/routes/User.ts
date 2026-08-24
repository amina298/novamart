import { Router } from "express";
import { registerUser, getProfile, updateProfile, deleteProfile } from "../controllers/User";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.delete("/profile", authenticate, deleteProfile);
export default router;