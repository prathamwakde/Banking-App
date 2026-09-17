import express from "express";
import {
  overview,
  setMemberStatus,
  listWithdrawals,
  decideWithdrawal,
  listTickets,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, adminOnly);

router.get("/overview", overview);
router.put("/members/:id/status", setMemberStatus);
router.get("/withdrawals", listWithdrawals);
router.put("/withdrawals/:id", decideWithdrawal);
router.get("/tickets", listTickets);

export default router;
