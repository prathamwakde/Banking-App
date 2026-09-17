import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 100 },
    method: { type: String, enum: ["upi", "bank"], default: "upi" },
    account: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    remark: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Withdrawal", withdrawalSchema);
