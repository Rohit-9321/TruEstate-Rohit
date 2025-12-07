import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";
import { loadCsvIntoMemory } from "./utils/csvLoader.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Load CSV once at startup
await loadCsvIntoMemory();

app.use("/api/sales", salesRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Sales Management API" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
