import { Request, Response } from "express";
import { db } from "../../config/db";
import {
  cartItemsTable,
  productsTable,
  categoriesTable,
} from "../../config/schema";
import { and, eq, sql } from "drizzle-orm";

// TAMBAH KE KERANJANG
const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = Number(res.locals.user?.id);
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity ?? 1);

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!productId || !Number.isInteger(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient product stock",
      });
    }

    const [existingItem] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.userId, userId),
          eq(cartItemsTable.productId, productId),
        ),
      );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: "Quantity exceeds available stock",
        });
      }

      await db
        .update(cartItemsTable)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItemsTable.id, existingItem.id));
    } else {
      await db.insert(cartItemsTable).values({
        userId,
        productId,
        quantity,
      });
    }

    return res.status(200).json({
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: "Failed to add product to cart",
    });
  }
};

// GET
const getCart = async (req: Request, res: Response) => {
  try {
    const userId = Number(res.locals.user?.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const cartItems = await db
      .select({
        id: cartItemsTable.id,
        productId: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        category: categoriesTable.name,
        price: productsTable.price,
        stock: productsTable.stock,
        imageUrl: productsTable.imageUrl,
        quantity: cartItemsTable.quantity,
        subtotal: sql<string>`(${productsTable.price} * ${cartItemsTable.quantity})`,
      })
      .from(cartItemsTable)
      .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .leftJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .where(eq(cartItemsTable.userId, userId));

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: {
        cart: cartItems,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve cart",
    });
  }
};

// UPDATE
const updateCart = async (req: Request, res: Response) => {
  try {
    const userId = Number(res.locals.user?.id);
    const cartId = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!Number.isInteger(cartId) || cartId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const [cartItem] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.id, cartId),
          eq(cartItemsTable.userId, userId)
        )
      );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, cartItem.productId));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }

    await db
      .update(cartItemsTable)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItemsTable.id, cartId));

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// HAPUS 1 PRODUK
const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = Number(res.locals.user?.id);
    const cartId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!Number.isInteger(cartId) || cartId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart ID",
      });
    }

    const [cartItem] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.id, cartId),
          eq(cartItemsTable.userId, userId)
        )
      );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.id, cartId),
          eq(cartItemsTable.userId, userId)
        )
      );

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

// HAPUS SEMUA PRODUK

const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = Number(res.locals.user?.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await db
      .delete(cartItemsTable)
      .where(eq(cartItemsTable.userId, userId));

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

export default {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
};
