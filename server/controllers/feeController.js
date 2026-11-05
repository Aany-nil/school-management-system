const Fee = require("../models/Fee");
const User = require("../models/User");

// Reusable student population
const populateStudent = (query) => {
  return query.populate({
    path: "student",
    select: "name email role rollNumber classId",
    populate: {
      path: "classId",
      select: "className section academicYear",
    },
  });
};

// CREATE FEE
const createFee = async (req, res) => {
  try {
    const {
      student,
      feeType = "Tuition Fee",
      totalFee,
      paidAmount = 0,
      paymentMethod = "Cash",
    } = req.body;

    if (!student || totalFee === undefined) {
      return res.status(400).json({
        success: false,
        message: "Student and total fee are required",
      });
    }

    const studentInfo = await User.findById(student);

    if (!studentInfo || studentInfo.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const total = Number(totalFee);
    const paid = Number(paidAmount);

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(paid) ||
      total < 0 ||
      paid < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee amount",
      });
    }

    if (paid > total) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot be greater than total fee",
      });
    }

    const allowedMethods = [
      "Cash",
      "Bank Transfer",
      "Mobile Banking",
      "Card",
      "Other",
    ];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const dueAmount = total - paid;

    let status = "Due";

    if (dueAmount === 0) {
      status = "Paid";
    } else if (paid > 0) {
      status = "Partial";
    }

    const fee = await Fee.create({
      student,
      feeType: feeType.trim() || "Tuition Fee",
      totalFee: total,
      paidAmount: paid,
      dueAmount,
      paymentMethod,
      status,
    });

    const populatedFee = await populateStudent(
      Fee.findById(fee._id)
    );

    return res.status(201).json({
      success: true,
      message: "Fee created successfully",
      data: populatedFee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create fee",
      error: error.message,
    });
  }
};

// GET ALL FEES (ADMIN)
const getAllfees = async (req, res) => {
  try {
    const fees = await populateStudent(
      Fee.find()
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fee records retrieved successfully",
      data: {
        fees,
        count: fees.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve fee records",
      error: error.message,
    });
  }
};

// GET LOGGED-IN STUDENT'S FEES
const getStudentFee = async (req, res) => {
  try {
    const studentFees = await populateStudent(
      Fee.find({
        student: req.user._id,
      })
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: studentFees.length
        ? "Student fees retrieved successfully"
        : "No fee record found",
      data: studentFees,
      count: studentFees.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your fees",
      error: error.message,
    });
  }
};

// DELETE FEE
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    await Fee.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete fee",
      error: error.message,
    });
  }
};

module.exports = {
  createFee,
  getAllfees,
  getStudentFee,
  deleteFee,
};