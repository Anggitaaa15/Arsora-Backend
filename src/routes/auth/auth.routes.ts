import { Router } from "express";
import authController from "../../controllers/auth/auth.controller";

const router = Router();

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

// logout
router.post("/logout", authController.logout);

export default router;