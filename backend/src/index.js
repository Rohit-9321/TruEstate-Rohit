import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";
import { loadCsvIntoMemory } from "./utils/csvLoader.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ⭐ Allowed Frontend URLs
const allowedOrigins = [
  "https://truestate-rohit.onrender.com",                  // your frontend prod
  "http://localhost:5173"                                  // local dev
];

// ⭐ Use CORS with whitelist
app.use(
  cors({
    origin: (origin, callback) => {
      // allow no origin requests (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed for this origin: " + origin), false);
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
    console.log("CSV loaded into memory");

    // API route
    app.use("/api/sales", salesRoutes);

    // health check
    app.get("/", (_req, res) => {
      res.json({ status: "ok", message: "Sales Management API running" });
    });

    app.listen(PORT, () =>
      console.log(`Backend running on PORT ${PORT}`)
    );

  } catch (error) {
    console.error("Startup failed:", error);
  }
}

startServer();
