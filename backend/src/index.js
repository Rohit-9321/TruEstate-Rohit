import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { buildCsvIndex } from "./utils/csvLoader.js";
import salesRoutes from "./routes/salesRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/sales", salesRoutes);

(async () => {
  console.log("📥 Building CSV index...");
  await buildCsvIndex();
  console.log("🚀 CSV ready");

  app.listen(PORT, () => console.log(`🔥 Server running on ${PORT}`));
})();
