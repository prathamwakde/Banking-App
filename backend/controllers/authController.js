import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const makeReferralId = (name) => {
  const prefix = (name || "GGN")
    .slice(0, 3)
    .toUpperCase();

  return (
    prefix +
    Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()
  );
};

// REGISTER
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      confirmPassword,
      referralId,
    } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        message:
          "Fill in name, email, mobile and password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already registered",
      });
    }

    let referredBy = null;

    if (referralId && referralId.trim()) {
      const sponsor = await User.findOne({
        myReferralId: referralId.trim().toUpperCase(),
      });

      if (!sponsor) {
        return res.status(400).json({
          message: "Referral ID not found",
        });
      }

      referredBy = sponsor._id;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password,
      referredBy,
      myReferralId: makeReferralId(name),
      level: referredBy ? 2 : 1,
    });

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Email or password is incorrect",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email or password is incorrect",
      });
    }

    const token = signToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    next(error);
  }
};

// GET CURRENT USER
export const me = async (req, res) => {
  res.json(req.user);
};