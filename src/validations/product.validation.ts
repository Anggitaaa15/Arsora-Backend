import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(150),
  categoryId: z.coerce.number().int().positive("Kategori tidak valid"),
  price: z.coerce.number().positive("Harga harus lebih dari 0"),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});