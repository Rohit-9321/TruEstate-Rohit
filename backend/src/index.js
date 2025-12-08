import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";
import { loadCsvIntoMemory } from "./utils/csvLoader.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * ⭐ Production + Local Allowed Origins
 */
const allowedOrigins = [
  "https://truestate-rohit.onrender.com",               // Frontend prod (Render)
  "https://truestate-rohit-production.up.railway.app", // Backend domain
  "http://localhost:5173"                              // Local frontend dev
];

/**
 * ⭐ CORS Setup with Wildcard Matching
 */
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔍 Incoming Origin:", origin);

      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // Allow if origin starts with (not strict match)
      if (allowedOrigins.some(url => origin.startsWith(url))) {
        console.log("✅ CORS Allowed:", origin);
        return callback(null, true);
      }

      console.log("❌ CORS Blocked:", origin);
      return callback(new Error("CORS not allowed: " + origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ⭐ Required: Handle preflight (OPTIONS) properly
app.options("*", cors());

/**
 * ⭐ Middleware
 */
app.use(express.json());
app.use(morgan("dev"));

/**
 * ⭐ Start Server + Load CSV
 */
async function startServer() {
  try {
    await loadCsvIntoMemory();
    console.log("📊 CSV Data Loaded Successfully");

    // API Routes
    app.use("/api/sales", salesRoutes);

    // Health check endpoint
    app.get("/", (_req, res) => {
      res.json({
        status: "ok",
        message: "Sales API Running 🚀"
      });
    });

    // Launch Server
    app.listen(PORT, () => {
      console.log(`🚀 Backend Live on PORT ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server Startup Failed:", error);
  }
}

startServer();
