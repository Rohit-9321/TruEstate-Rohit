import { Router } from "express";
import { getSales, getFilters } from "../controllers/salesController.js";

const router = Router();

router.get("/", getSales);
router.get("/filters", getFilters);

export default router;
