import express from "express";
import { createTicket, myTickets, replyToTicket } from "../controllers/supportController.js";
import { protect } from "../middleware/auth.js";
import { requireFields } from "../middleware/validate.js";

const router = express.Router();
router.use(protect);

router.route("/").get(myTickets).post(requireFields("subject", "message"), createTicket);
router.post("/:id/reply", requireFields("message"), replyToTicket);

export default router;
