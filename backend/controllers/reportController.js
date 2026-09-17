import User from "../models/userModel.js";
import Payment from "../models/Payment.js";

// GET /api/report/income?months=6
export const incomeReport = async (req, res, next) => {
  try {
    const months = Math.min(Number(req.query.months) || 6, 24);
    const from = new Date();
    from.setMonth(from.getMonth() - (months - 1));
    from.setDate(1);
    from.setHours(0, 0, 0, 0);

    const rows = await Payment.aggregate([
      { $match: { user: req.user._id, type: "credit", createdAt: { $gte: from } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(
      rows.map((r) => ({
        period: `${r._id.year}-${String(r._id.month).padStart(2, "0")}`,
        total: r.total,
        entries: r.count,
      }))
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/report/levels — how many members sit at each level below you
export const levelReport = async (req, res, next) => {
  try {
    let frontier = [req.user._id];
    const levels = [];

    for (let depth = 1; depth <= 3 && frontier.length; depth++) {
      const members = await User.find({ referredBy: { $in: frontier } }).select("_id isPaid");
      levels.push({
        level: depth,
        members: members.length,
        paid: members.filter((m) => m.isPaid).length,
      });
      frontier = members.map((m) => m._id);
    }

    res.json(levels);
  } catch (err) {
    next(err);
  }
};
