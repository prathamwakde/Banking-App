import express from "express";
import { incomeReport, levelReport } from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/income", incomeReport);
router.get("/levels", levelReport);

export default router;
