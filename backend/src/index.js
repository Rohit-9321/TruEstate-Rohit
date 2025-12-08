import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import salesRoutes from "./routes/salesRoutes.js";
import { buildCsvIndex } from "./utils/csvLoader.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ SIMPLE CORS: allow Render frontend + local dev
const allowedOrigins = [
  "https://truestate-rohit.onrender.com", // Render frontend
  "http://localhost:5173"                 // local Vite dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin), false);
    },
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// 🔗 API routes
app.use("/api/sales", salesRoutes);

// health-check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Sales API running 🚀" });
});

// ⬇️ build CSV index, THEN start server
(async () => {
  try {
    console.log("📥 Building CSV index...");
    await buildCsvIndex();
    console.log("📊 CSV index ready");

    app.listen(PORT, () => {
      console.log(`🔥 Backend running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
