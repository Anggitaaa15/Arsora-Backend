import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Arsora API berhasil berjalan");
});

app.listen(PORT, () => {
  console.log(
    `[server]: Arsora API berjalan di http://localhost:${PORT}`
  );
});
