import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

// 👉 change these two values before running
const EMAIL = "your-test-account@example.com";
const AMOUNT_TO_CREDIT = 1000;

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email: EMAIL });
    if (!user) {
      console.log(`No user found with email: ${EMAIL}`);
      process.exit(1);
    }

    user.balance += AMOUNT_TO_CREDIT;
    user.totalIncome += AMOUNT_TO_CREDIT;
    await user.save();

    console.log(`✅ Credited ₹${AMOUNT_TO_CREDIT} to ${user.email}`);
    console.log(`   New balance: ₹${user.balance}`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

run();