const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    feeType: {
      type: String,
      trim: true,
      default: "Tuition Fee",
    },

    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Mobile Banking", "Card", "Other"],
      default: "Cash",
    },

    status: {
      type: String,
      enum: ["Paid", "Partial", "Due"],
      default: "Due",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fee", feeSchema);