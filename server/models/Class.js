const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "class name is required"],
      trim: true,
    },

    section: {
      type: String,
      required: [true, "section is required"],
      trim: true,
    },

    academicYear: {
      type: Number,
      required: [true, "academic year is required"],
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "teacher is required"],
    },

    // Last generated roll number for this class and section
    nextRollNumber: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", classSchema);