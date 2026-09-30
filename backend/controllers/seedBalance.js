import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Payment from "../models/Payment.js";

dotenv.config();

// Usage (from the backend folder):
//   node controllers/seedBalance.js <email> [amount]
// Example:
//   node controllers/seedBalance.js pratham@gmail.com 1000
const EMAIL = "prathamwakde859@gmail.com";
const AMOUNT_TO_CREDIT = Number(process.argv[3] || 1000);

const run = async () => {
  try {
    if (!EMAIL) {
      console.log("Usage: node controllers/seedBalance.js <email> [amount]");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email: EMAIL.toLowerCase() });
    if (!user) {
      console.log(`No user found with email: ${EMAIL}`);
      process.exit(1);
    }

    user.balance += AMOUNT_TO_CREDIT;
    user.totalIncome += AMOUNT_TO_CREDIT;
    await user.save();

    // Also add a credit entry so it shows in Payment history
    await Payment.create({
      user: user._id,
      amount: AMOUNT_TO_CREDIT,
      type: "credit",
      status: "paid",
      note: "Test credit",
    });

    console.log(`✅ Credited ₹${AMOUNT_TO_CREDIT} to ${user.email}`);
    console.log(`   New balance: ₹${user.balance}`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

run();