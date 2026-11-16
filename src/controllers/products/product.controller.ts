import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "../../validations/product.validation";
import { db } from "../../config/db";
import { productsTable, categoriesTable } from "../../config/schema";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../service/cloudinary.service";

export class ProductsController {
  // CREATE
  createProduct = async (req: Request, res: Response) => {
    try {
      const validatedData = createProductSchema.parse(req.body);

      const { name, categoryId, price, stock, description } =
        validatedData;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Gambar produk wajib diunggah",
        });
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer);

      const [insertedProduct] = await db
        .insert(productsTable)
        .values({
          name,
          categoryId,
          price: String(price),
          stock,
          description,
          imageUrl: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id,
        })
        .returning();

      return res.status(201).json({
        success: true,
        message: "Produk berhasil ditambahkan",
        data: insertedProduct,
      });
    } catch (error) {
      console.error("Create product error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // READ - Get Products
  getProducts = async (_req: Request, res: Response) => {
    try {
      const products = await db
        .select({
          id: productsTable.id,
          categoryId: productsTable.categoryId,
          category: categoriesTable.name,
          name: productsTable.name,
          description: productsTable.description,
          price: productsTable.price,
          stock: productsTable.stock,
          imageUrl: productsTable.imageUrl,
          imagePublicId: productsTable.imagePublicId,
          createdAt: productsTable.createdAt,
          updatedAt: productsTable.updatedAt,
        })
        .from(productsTable)
        .leftJoin(
          categoriesTable,
          eq(productsTable.categoryId, categoriesTable.id),
        )
        .orderBy(desc(productsTable.createdAt));

      return res.status(200).json({
        success: true,
        message: "Produk berhasil diambil",
        data: {
          products,
        },
      });
    } catch (error) {
      console.error("Get products error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Read - Get By Id
  getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = productIdSchema.parse(req.params);

      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Produk tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Produk berhasil diambil",
        data: {
          product,
        },
      });
    } catch (error) {
      console.error("Get product by ID error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // UPDATE
  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = productIdSchema.parse(req.params);
      const validatedData = updateProductSchema.parse(req.body);

      const [existingProduct] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id));

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Produk tidak ditemukan",
        });
      }

      let imageUrl = existingProduct.imageUrl;
      let imagePublicId = existingProduct.imagePublicId;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);

        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const [updatedProduct] = await db
        .update(productsTable)
        .set({
          ...(validatedData.name !== undefined && { name: validatedData.name }),
          ...(validatedData.categoryId !== undefined && {
            categoryId: validatedData.categoryId,
          }),
          ...(validatedData.price !== undefined && {
            price: String(validatedData.price),
          }),
          ...(validatedData.stock !== undefined && {
            stock: validatedData.stock,
          }),
          ...(validatedData.description !== undefined && {
            description: validatedData.description,
          }),
          ...(req.file && {
            imageUrl,
            imagePublicId,
          }),
          updatedAt: new Date(),
        })
        .where(eq(productsTable.id, id))
        .returning();

      // Hapus gambar lama setelah data berhasil diperbarui
      if (req.file && existingProduct.imagePublicId) {
        await deleteFromCloudinary(existingProduct.imagePublicId);
      }

      return res.status(200).json({
        success: true,
        message: "Produk berhasil diperbarui",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Update product error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // DELETE
  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = productIdSchema.parse(req.params);

      const [existingProduct] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id));

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Produk tidak ditemukan",
        });
      }

      await db.delete(productsTable).where(eq(productsTable.id, id));

      if (existingProduct.imagePublicId) {
        await deleteFromCloudinary(existingProduct.imagePublicId);
      }

      return res.status(200).json({
        success: true,
        message: "Produk berhasil dihapus",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new ProductsController();
