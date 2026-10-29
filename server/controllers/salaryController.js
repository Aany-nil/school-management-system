
const Salary = require("../models/Salary");
const User = require("../models/User");

// Create monthly salary using teacher's fixed monthly salary
const createSalary = async (req, res) => {
    try {
        const { teacher, month } = req.body;

        if (
            !teacher ||
            !month ||
            !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid teacher and month are required (YYYY-MM)",
            });
        }

        const teacherInfo = await User.findById(teacher);

        if (!teacherInfo || teacherInfo.role !== "teacher") {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        // Read the teacher's fixed monthly salary
        const salaryAmount = teacherInfo.monthlySalary;

        if (
            typeof salaryAmount !== "number" ||
            !Number.isFinite(salaryAmount) ||
            salaryAmount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please set a valid fixed monthly salary for this teacher first",
            });
        }

        // Prevent duplicate salary for the same teacher and month
        const existingSalary = await Salary.findOne({
            teacher,
            month,
        });

        if (existingSalary) {
            return res.status(409).json({
                success: false,
                message: "Salary record already exists for this teacher and month",
            });
        }

        const salary = await Salary.create({
            teacher,
            month,
            salaryAmount,
            paidAmount: 0,
            dueAmount: salaryAmount,
            status: "Due",
        });

        return res.status(201).json({
            success: true,
            message: "Monthly salary created successfully",
            data: salary,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create salary",
            error: error.message,
        });
    }
};


// Get all salary records (Admin)
const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find()
            .populate("teacher", "name email monthlySalary")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Salary records retrieved successfully",
            data: {
                salaries,
                count: salaries.length,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve salary records",
            error: error.message,
        });
    }
};


// Update salary payment (Admin)
const updateSalaryPayment = async (req, res) => {
    try {
        const { paidAmount } = req.body;

        if (
            typeof paidAmount !== "number" ||
            !Number.isFinite(paidAmount) ||
            paidAmount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Paid amount must be a positive number",
            });
        }

        const salary = await Salary.findById(req.params.id);

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: "Salary record not found",
            });
        }

        if (paidAmount > salary.dueAmount) {
            return res.status(400).json({
                success: false,
                message: "Payment cannot be greater than the due amount",
            });
        }

        // Add this payment to the previous paid amount
        salary.paidAmount += paidAmount;

        // Calculate the remaining due
        salary.dueAmount = Math.max(
            0,
            salary.salaryAmount - salary.paidAmount
        );

        // Update payment status
        if (salary.dueAmount === 0) {
            salary.status = "Paid";
        } else if (salary.paidAmount > 0) {
            salary.status = "Partial";
        } else {
            salary.status = "Due";
        }

        salary.paymentDate = new Date();

        await salary.save();

        return res.status(200).json({
            success: true,
            message: "Salary payment updated successfully",
            data: salary,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update salary payment",
            error: error.message,
        });
    }
};


// Get logged-in teacher's salary history
const getTeacherSalary = async (req, res) => {
    try {
        const salaries = await Salary.find({
            teacher: req.user._id,
        }).sort({ month: -1 });

        return res.status(200).json({
            success: true,
            message: "Teacher salary history retrieved successfully",
            data: {
                salaries,
                count: salaries.length,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve teacher salary history",
            error: error.message,
        });
    }
};


// Get salary payslip
const getSalaryPayslip = async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id)
            .populate("teacher", "name email monthlySalary");

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: "Salary record not found",
            });
        }

        // A teacher can only view their own payslip
        if (
            req.user.role === "teacher" &&
            salary.teacher._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot view another teacher's payslip",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Salary payslip retrieved successfully",
            data: {
                paySlipNumber: salary._id.toString(),
                teacher: salary.teacher,
                month: salary.month,
                salaryAmount: salary.salaryAmount,
                paidAmount: salary.paidAmount,
                dueAmount: salary.dueAmount,
                status: salary.status,
                paymentDate: salary.paymentDate,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve salary payslip",
            error: error.message,
        });
    }
};


// Delete salary record (Admin)
const deleteSalary = async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id);

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: "Salary record not found",
            });
        }

        await Salary.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Salary record deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete salary record",
            error: error.message,
        });
    }
};


module.exports = {
    createSalary,
    getAllSalaries,
    updateSalaryPayment,
    getTeacherSalary,
    getSalaryPayslip,
    deleteSalary,
};