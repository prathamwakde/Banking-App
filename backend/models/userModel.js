import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    myReferralId: {
      type: String,
      unique: true,
      index: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    level: {
      type: Number,
      default: 1,
    },

    balance: {
      type: Number,
      default: 0,
    },

    totalIncome: {
      type: Number,
      default: 0,
    },

    levelProfit: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Check password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Safe user data
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();

  delete obj.password;

  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;