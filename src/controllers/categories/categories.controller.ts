
import { Request, Response } from "express";
import { asc } from "drizzle-orm";
import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await db
      .select()
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.name));

    return res.status(200).json({
      success: true,
      message: "Kategori berhasil diambil",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori",
    });
  }
};
