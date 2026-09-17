import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], default: "credit" },
    note: { type: String, default: "" },
    status: { type: String, enum: ["paid", "unpaid"], default: "paid" },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
