import User from "../models/userModel.js";
import Payment from "../models/Payment.js";

// Joining fee and how much of it each upline level earns.
export const JOIN_AMOUNT = Number(process.env.JOIN_AMOUNT || 500);
export const LEVEL_SHARE = [0.4, 0.2, 0.1]; // level 1, 2, 3

/**
 * Walk up to three sponsors above `user` and credit each their share.
 * Returns the list of credits that were made.
 */
export const payUplineCommission = async (user, baseAmount = JOIN_AMOUNT) => {
  const credits = [];
  let current = user.referredBy;

  for (let level = 0; level < LEVEL_SHARE.length && current; level++) {
    const sponsor = await User.findById(current);
    if (!sponsor) break;

    const amount = Math.round(baseAmount * LEVEL_SHARE[level]);
    sponsor.balance += amount;
    sponsor.totalIncome += amount;
    sponsor.levelProfit += amount;
    await sponsor.save();

    await Payment.create({
      user: sponsor._id,
      amount,
      type: "credit",
      status: "paid",
      note: `Level ${level + 1} commission from ${user.name}`,
    });

    credits.push({ sponsor: sponsor._id, level: level + 1, amount });
    current = sponsor.referredBy;
  }

  return credits;
};