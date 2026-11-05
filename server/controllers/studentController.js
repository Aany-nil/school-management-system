const mongoose = require("mongoose");
const User = require("../models/User");
const Class = require("../models/Class");

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .populate("classId", "className section academicYear")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Students retrieved successfully",
      count: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve students",
      error: error.message,
    });
  }
};

// Get Student By ID
const getStudentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
    })
      .select("-password")
      .populate("classId", "className section academicYear");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student",
      error: error.message,
    });
  }
};

// Get Teacher's Students
const getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const classes = await Class.find({
      teacherId,
    }).select("_id");

    const classIds = classes.map((classItem) => classItem._id);

    const students = await User.find({
      role: "student",
      classId: { $in: classIds },
    })
      .select("-password")
      .populate("classId", "className section academicYear")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your students retrieved successfully",
      count: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your students",
      error: error.message,
    });
  }
};

// Assign Student To Class + Generate Roll Number
const assignStudentToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    const student = await User.findOne({
      _id: id,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Same class and already has roll: keep the existing roll
    if (
      student.classId &&
      student.classId.toString() === classId &&
      student.rollNumber
    ) {
      const existingStudent = await User.findById(student._id)
        .select("-password")
        .populate("classId", "className section academicYear");

      return res.status(200).json({
        success: true,
        message: "Student is already assigned to this class",
        data: existingStudent,
      });
    }

    // Atomically increase the class-section counter
    const updatedClass = await Class.findOneAndUpdate(
      { _id: classId },
      { $inc: { nextRollNumber: 1 } },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Format: 01, 02, 03...
    const newRollNumber = String(updatedClass.nextRollNumber).padStart(2, "0");

    student.classId = updatedClass._id;
    student.rollNumber = newRollNumber;

    await student.save();

    const updatedStudent = await User.findById(student._id)
      .select("-password")
      .populate("classId", "className section academicYear");

    return res.status(200).json({
      success: true,
      message: "Class assigned and roll number generated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Assign student error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign class",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getMyStudents,
  assignStudentToClass,
};