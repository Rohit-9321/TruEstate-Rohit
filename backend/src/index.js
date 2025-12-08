import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";
import { loadCsvIntoMemory } from "./utils/csvLoader.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ⭐ FINAL CORS FIX – DO NOT TOUCH
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

// routes before CSV load
app.use("/api/sales", salesRoutes);

async function startServer() {
  try {
    console.log("📥 Loading CSV...");
    await loadCsvIntoMemory();
    console.log("📊 CSV Loaded Successfully");

    app.get("/", (_req, res) => {
      res.json({ status: "ok", message: "Sales API running 🚀" });
    });

    app.listen(PORT, () => console.log(`🔥 Backend live on ${PORT}`));
  } catch (error) {
    console.error("❌ Startup Failed:", error);
  }
}

startServer();
