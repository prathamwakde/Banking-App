import express from "express";
import { getWallet, activateAccount, requestWithdrawal } from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";
import { requireFields, isPositiveNumber } from "../middleware/validate.js";

const router = express.Router();
router.use(protect);

router.get("/", getWallet);
router.post("/activate", activateAccount);
router.post("/withdraw", requireFields("amount", "account"), isPositiveNumber("amount"), requestWithdrawal);

export default router;
