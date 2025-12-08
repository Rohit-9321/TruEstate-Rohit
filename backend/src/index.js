import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";
import { loadCsvIntoMemory } from "./utils/csvLoader.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ⭐ Allow ALL in production safely temporarily
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// Routes BEFORE CSV load
app.use("/api/sales", salesRoutes);

async function startServer() {
  console.log("📥 Loading CSV...");
  try {
    await loadCsvIntoMemory();
    console.log("📊 CSV Loaded Successfully");
  } catch (error) {
    // Don't crash the entire server for a CSV load error in production
    console.error("❌ CSV load failed — continuing with empty dataset:", error.message || error);
  }

  // Health route
  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Sales API running 🚀" });
  });

  app.listen(PORT, () => console.log(`🔥 Backend live on ${PORT}`));
}

startServer();
