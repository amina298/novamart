import { Router } from "express";
import { loginUser } from "../controllers/Login";

const router = Router();

router.post("/login", loginUser);

export default router;