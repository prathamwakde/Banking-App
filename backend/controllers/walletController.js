import User from "../models/userModel.js";
import Payment from "../models/Payment.js";
import Withdrawal from "../models/Withdrawal.js";
import { JOIN_AMOUNT, payUplineCommission } from "../utils/commission.js";

// GET /api/wallet
export const getWallet = async (req, res, next) => {
  try {
    const [payments, withdrawals] = await Promise.all([
      Payment.find({ user: req.user._id }).sort("-createdAt").limit(50),
      Withdrawal.find({ user: req.user._id }).sort("-createdAt").limit(50),
    ]);

    const pending = withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + w.amount, 0);

    res.json({
      balance: req.user.balance,
      totalIncome: req.user.totalIncome,
      pendingWithdrawal: pending,
      withdrawable: Math.max(req.user.balance - pending, 0),
      joinAmount: JOIN_AMOUNT,
      isPaid: req.user.isPaid,
      payments,
      withdrawals,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/wallet/activate  — pay the joining fee, upline earns commission
export const activateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isPaid) {
      res.status(400);
      throw new Error("This account is already active");
    }

    user.isPaid = true;
    user.status = "active";
    await user.save();

    await Payment.create({
      user: user._id,
      amount: JOIN_AMOUNT,
      type: "debit",
      status: "paid",
      note: "Joining fee",
    });

    const credits = await payUplineCommission(user);

    res.json({ message: "Account activated", joinAmount: JOIN_AMOUNT, credits: credits.length });
  } catch (err) {
    next(err);
  }
};

// POST /api/wallet/withdraw
export const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, method, account } = req.body;

    const pending = await Withdrawal.find({ user: req.user._id, status: "pending" });
    const locked = pending.reduce((sum, w) => sum + w.amount, 0);

    if (amount > req.user.balance - locked) {
      res.status(400);
      throw new Error("Amount is more than your available balance");
    }

    const withdrawal = await Withdrawal.create({
      user: req.user._id,
      amount,
      method: method || "upi",
      account,
    });

    res.status(201).json(withdrawal);
  } catch (err) {
    next(err);
  }
};
