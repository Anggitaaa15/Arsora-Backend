import express from "express";
import cors from "cors";
import authRouter from "./routes/auth/auth.routes";
import productRoutes from "./routes/products/product.routes";
import categoryRoutes from "./routes/categories/category.routes";
import cartRouter from "./routes/cart/cart.routes"

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter)

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("Arsora API berhasil berjalan");
});

app.listen(PORT, () => {
  console.log(
    `[server]: Arsora API berjalan di http://localhost:${PORT}`
  );
});
