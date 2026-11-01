const mongoose = require("mongoose");
const User = require("../models/User");
const Class = require("../models/Class");




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


const getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const classes = await Class.find({
      teacherId: teacherId,
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


module.exports = {
  getAllStudents,
  getStudentById,
  getMyStudents,
};