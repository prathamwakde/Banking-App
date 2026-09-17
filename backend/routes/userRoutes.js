import express from "express";
import {
  getDashboard,
  getMyTeam,
  getPayments,
  updateProfile,
  getAllMembers,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/team", getMyTeam);
router.get("/payments", getPayments);
router.put("/profile", updateProfile);
router.get("/all", adminOnly, getAllMembers);

export default router;
