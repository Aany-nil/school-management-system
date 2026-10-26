const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Fee = require("../models/Fee");
const Notice = require("../models/Notice");
const Result = require("../models/Result");
const Salary = require("../models/Salary");
const Subject = require("../models/Subject");
const User = require("../models/User");

const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalClasses = await Class.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalResults = await Result.countDocuments();
    const totalNotices = await Notice.countDocuments();

    const fees = await Fee.find();
    const salaries = await Salary.find();

    let totalFee = 0;
    let paidFee = 0;
    let dueFee = 0;

    for (const fee of fees) {
      totalFee += fee.totalFee || 0;
      paidFee += fee.paidAmount || 0;
      dueFee += fee.dueAmount || 0;
    }

    let totalSalary = 0;
    let paidSalary = 0;
    let dueSalary = 0;

    for (const salary of salaries) {
      totalSalary += salary.salaryAmount || 0;
      paidSalary += salary.paidAmount || 0;
      dueSalary += salary.dueAmount || 0;
    }

    const present = await Attendance.countDocuments({
      status: "Present",
    });

    const absent = await Attendance.countDocuments({
      status: "Absent",
    });

    const late = await Attendance.countDocuments({
      status: "Late",
    });

    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard retrieved successfully",
      data: {
        overview: {
          totalStudents,
          totalTeachers,
          totalClasses,
          totalSubjects,
          totalAttendance,
          totalResults,
          totalNotices,
        },

        fees: {
          totalFee,
          paidFee,
          dueFee,
        },

        salary: {
          totalSalary,
          paidSalary,
          dueSalary,
        },

        attendance: {
          present,
          absent,
          late,
        },

        recentNotices,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin dashboard",
      error: error.message,
    });
  }
};

const getTeacherDashboard = async (req, res) => {

  try {
    const teacher = await User.findOne({
      _id: req.user._id,
      role: "teacher",
    }).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const totalClasses = await Class.countDocuments();
    const totalSubjects = await Subject.countDocuments();

    const recentNotices = await Notice.find({
      targetRole: { $in: ["all", "teacher"] },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: "Teacher dashboard retrieved successfully",
      data: {
        profile: teacher,
        totalClasses,
        totalSubjects,
        recentNotices,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher dashboard",
      error: error.message,
    });
  }
};

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const fees = await Fee.find({ student: studentId });

    let totalFee = 0;
    let paidFee = 0;
    let dueFee = 0;

    for (const fee of fees) {
      totalFee += fee.totalFee || 0;
      paidFee += fee.paidAmount || 0;
      dueFee += fee.dueAmount || 0;
    }

    const present = await Attendance.countDocuments({
      student: studentId,
      status: "Present",
    });

    const absent = await Attendance.countDocuments({
      student: studentId,
      status: "Absent",
    });

    const late = await Attendance.countDocuments({
      student: studentId,
      status: "Late",
    });

    const results = await Result.find({ studentId })
      .populate("classId", "name")
      .populate("subjectId", "subjectName")
      .sort({ createdAt: -1 });

    const recentNotices = await Notice.find({
      targetRole: { $in: ["all", "student"] },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: "Student dashboard retrieved successfully",
      data: {
        profile: student,

        fees: {
          totalFee,
          paidFee,
          dueFee,
        },

        attendance: {
          present,
          absent,
          late,
        },

        results,
        recentNotices,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student dashboard",
      error: error.message,
    });
  }
};


module.exports = {
    getAdminDashboard,
    getTeacherDashboard,
    getStudentDashboard
}
