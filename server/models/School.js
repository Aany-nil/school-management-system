
const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
    },

    schoolCode: {
      type: String,
      required: [true, "School code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    modules: {
      students: {
        type: Boolean,
        default: true,
      },
      teachers: {
        type: Boolean,
        default: true,
      },
      classesSubjects: {
        type: Boolean,
        default: true,
      },
      attendanceResults: {
        type: Boolean,
        default: true,
      },
      feesSalaries: {
        type: Boolean,
        default: true,
      },
      routineNotices: {
        type: Boolean,
        default: true,
      },
      settings: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("School", schoolSchema);
