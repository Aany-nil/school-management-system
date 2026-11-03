
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: "My School",
      trim: true,
    },

    schoolEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    schoolPhone: {
      type: String,
      default: "",
      trim: true,
    },

    schoolAddress: {
      type: String,
      default: "",
      trim: true,
    },

    schoolLogo: {
      type: String,
      default: "",
    },

    academicYear: {
      type: String,
      default: "2026",
    },

    currentSession: {
      type: String,
      default: "2026-2027",
      trim: true,
    },

    semester: {
      type: String,
      enum: ["First Semester", "Second Semester", "Third Semester"],
      default: "First Semester",
    },

    language: {
      type: String,
      enum: ["English", "Bangla"],
      default: "English",
    },

    timezone: {
      type: String,
      default: "Asia/Dhaka",
    },

    dateFormat: {
      type: String,
      enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
      default: "DD/MM/YYYY",
    },
  },
  {
    timestamps: true,
  }
);

// Keep only one school settings document
settingsSchema.index({}, { unique: true });

module.exports = mongoose.model("Settings", settingsSchema);
