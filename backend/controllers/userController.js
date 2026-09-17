import User from "../models/userModel.js";
import Payment from "../models/Payment.js";

// GET /api/user/dashboard  (Page 3 - Client view page)
export const getDashboard = async (req, res, next) => {
  try {
    const me = req.user;

    const [totalMember, activeMember, inactiveMember, paidMember] = await Promise.all([
      User.countDocuments({ role: "client" }),
      User.countDocuments({ role: "client", status: "active" }),
      User.countDocuments({ role: "client", status: "inactive" }),
      User.countDocuments({ role: "client", isPaid: true }),
    ]);

    const direct = await User.find({ referredBy: me._id }).select("name status isPaid level createdAt");

    const paidReferrals = direct.filter((u) => u.isPaid).length;
    const unpaidReferrals = direct.length - paidReferrals;

    res.json({
      profile: {
        name: me.name,
        referralId: me.myReferralId,
        balance: me.balance,
      },
      members: { totalMember, activeMember, inactiveMember, paidMember },
      levels: {
        active1: direct.length,
        active2: direct.filter((u) => u.level === 2).length,
        active3: direct.filter((u) => u.level >= 3).length,
      },
      referrals: {
        directMember: direct.length,
        levelProfit: me.levelProfit,
        totalReferrals: direct.length,
        paidReferrals,
        unpaidReferrals,
      },
      income: {
        totalIncome: me.totalIncome,
        myTeam: direct.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/team
export const getMyTeam = async (req, res, next) => {
  try {
    const team = await User.find({ referredBy: req.user._id })
      .select("name email mobile status isPaid level createdAt")
      .sort("-createdAt");
    res.json(team);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/payments  (History payment / Overall record history)
export const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort("-createdAt");
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name ?? user.name;
    user.mobile = req.body.mobile ?? user.mobile;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
};

// GET /api/user/all  (admin)
export const getAllMembers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (err) {
    next(err);
  }
};
