import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import salesRoutes from "./src/routes/salesRoutes.js";
import { loadCsvIntoMemory } from "./src/utils/csvLoader.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

async function startServer() {
  try {
    await loadCsvIntoMemory();
    console.log("CSV loaded into memory");

    app.use("/api/sales", salesRoutes);

    app.get("/", (_req, res) => {
      res.json({ status: "ok", message: "Sales Management API" });
    });

    app.listen(PORT, () => {
      console.log(`Backend running on PORT ${PORT}`);
    });

  } catch (error) {
    console.error("Startup failed:", error);
  }
}

startServer();
