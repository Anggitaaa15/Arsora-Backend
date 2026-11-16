import { Router } from "express";
import { verifyToken } from "../../middleware/auth.middleware";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import productController, { ProductsController } from "../../controllers/products/product.controller";

const router = Router();

// Create
router.post("/", verifyToken, uploadSingleImage, productController.createProduct);

// Get
router.get("/", verifyToken, productController.getProducts);

// Get By Id
router.get("/:id", verifyToken, productController.getProductById);

// Update
router.put("/:id", verifyToken, uploadSingleImage, productController.updateProduct);

// Delete
router.delete("/:id", verifyToken, productController.deleteProduct);

export default router;

