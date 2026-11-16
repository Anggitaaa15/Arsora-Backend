import { Router } from "express";
import { verifyToken } from "../../middleware/auth.middleware";
import cartController from "../../controllers/cart/cart.controller";

const router = Router();

router.post("/", verifyToken, cartController.addToCart);
router.get("/", verifyToken, cartController.getCart);
router.put("/:id", verifyToken, cartController.updateCart);

// HAPUS SEMUA PRODUK
router.delete("/clear", verifyToken, cartController.clearCart);

// HAPUS SATU PRODUK
router.delete("/:id", verifyToken, cartController.removeFromCart);

export default router;