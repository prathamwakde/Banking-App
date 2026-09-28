import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import User from "./models/userModel.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "GroupGain API is running" }));

app.get("/api/dev/credit", async (req, res) => {
  try {
    const { email, amount } = req.query;
    if (!email || !amount) {
      return res.status(400).json({ message: "Pass ?email=...&amount=... in the URL" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: `No user found with email: ${email}` });

    const amt = Number(amount);
    user.balance += amt;
    user.totalIncome += amt;
    await user.save();

    res.json({ message: `Credited ₹${amt} to ${user.email}`, newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));