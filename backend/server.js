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

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "GroupGain API is running" }));

const api = express.Router();
api.use("/auth", authRoutes);
api.use("/user", userRoutes);
api.use("/wallet", walletRoutes);
api.use("/report", reportRoutes);
api.use("/support", supportRoutes);
api.use("/admin", adminRoutes);

// Doni paths var chalel: /api/auth/... ani /auth/...
app.use("/api", api);
app.use("/", api);

app.use(notFound);
app.use(errorHandler);

// Fakt local madhe listen kar, Vercel var nako
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;