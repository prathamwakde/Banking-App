import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
  },
  { timestamps: true }
);

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    category: { type: String, enum: ["payment", "account", "referral", "other"], default: "other" },
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
