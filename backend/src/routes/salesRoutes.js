import express from "express";
import { getFilters, getIndex } from "../utils/csvLoader.js";

const router = express.Router();

router.get("/filters", (_req, res) => {
  res.json(getFilters());
});

router.get("/", (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const start = (page - 1) * pageSize;
  const end = start + Number(pageSize);

  const index = getIndex();
  const paginated = index.slice(start, end);

  res.json({
    data: paginated,
    totalPages: Math.ceil(index.length / pageSize),
  });
});

export default router;
