import User from "../models/userModel.js";
import Payment from "../models/Payment.js";
import Withdrawal from "../models/Withdrawal.js";
import Ticket from "../models/Ticket.js";

// GET /api/admin/overview
export const overview = async (req, res, next) => {
  try {
    const [total, active, paid, openTickets, pendingWithdrawals, payout] = await Promise.all([
      User.countDocuments({ role: "client" }),
      User.countDocuments({ role: "client", status: "active" }),
      User.countDocuments({ role: "client", isPaid: true }),
      Ticket.countDocuments({ status: "open" }),
      Withdrawal.countDocuments({ status: "pending" }),
      Payment.aggregate([
        { $match: { type: "credit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      totalMembers: total,
      activeMembers: active,
      paidMembers: paid,
      openTickets,
      pendingWithdrawals,
      totalPaidOut: payout[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/members/:id/status
export const setMemberStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("Member not found");
    }
    if (req.body.status) user.status = req.body.status;
    if (typeof req.body.isPaid === "boolean") user.isPaid = req.body.isPaid;
    await user.save();
    res.json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/withdrawals
export const listWithdrawals = async (req, res, next) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const rows = await Withdrawal.find(filter).populate("user", "name email mobile").sort("-createdAt");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/withdrawals/:id
export const decideWithdrawal = async (req, res, next) => {
  try {
    const { status, remark } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      res.status(400);
      throw new Error("Status must be approved or rejected");
    }

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal || withdrawal.status !== "pending") {
      res.status(404);
      throw new Error("No pending request with that id");
    }

    if (status === "approved") {
      const user = await User.findById(withdrawal.user);
      if (user.balance < withdrawal.amount) {
        res.status(400);
        throw new Error("Member balance is lower than the requested amount");
      }
      user.balance -= withdrawal.amount;
      await user.save();

      await Payment.create({
        user: user._id,
        amount: withdrawal.amount,
        type: "debit",
        status: "paid",
        note: "Withdrawal paid out",
      });
    }

    withdrawal.status = status;
    withdrawal.remark = remark || "";
    await withdrawal.save();

    res.json(withdrawal);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/tickets
export const listTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate("user", "name email").sort("-createdAt");
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};
