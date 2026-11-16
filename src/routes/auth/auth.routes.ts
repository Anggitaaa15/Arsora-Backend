import { Router } from "express";
import authController from "../../controllers/auth/auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { uploadSingleImage } from "../../middleware/upload.middleware";

const router = Router();

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

// profile
router.get("/me", verifyToken, authController.getProfile);
router.put("/me", verifyToken, authController.updateProfile);
router.post(
  "/profile-image",
  verifyToken,
  uploadSingleImage,
  authController.updateProfileImage
);

// logout
router.post("/logout", authController.logout);

export default router;
