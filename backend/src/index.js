import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";
import { loadCsvIntoMemory } from "./utils/csvLoader.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ⭐ Allowed Frontend & Backend URLs
const allowedOrigins = [
  "https://truestate-rohit.onrender.com",                 // frontend prod
  "https://truestate-rohit-production.up.railway.app",    // backend (railway domain)
  "http://localhost:5173"                                 // dev
];

// ⭐ CORS with whitelist
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔎 Origin:", origin);

      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS not allowed: " + origin), false);
    },
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(express.json());
app.use(morgan("dev"));

async function startServer() {
  try {
    await loadCsvIntoMemory();
    console.log("CSV loaded ✔");

    app.use("/api/sales", salesRoutes);

    app.get("/", (_req, res) =>
      res.json({ status: "ok", message: "Sales API running" })
    );

    app.listen(PORT, () =>
      console.log(`Backend running 🚀 on PORT ${PORT}`)
    );

  } catch (error) {
    console.error("Startup failed ❌", error);
  }
}

startServer();
