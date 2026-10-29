
const User = require("../models/User");

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: "teacher" })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Teachers retrieved successfully",
            count: teachers.length,
            data: teachers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve teachers",
            error: error.message,
        });
    }
};


const getTeacherById = async (req, res) => {
    try {
        const teacher = await User.findOne({
            _id: req.params.id,
            role: "teacher",
        }).select("-password");

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Teacher retrieved successfully",
            data: teacher,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve teacher",
            error: error.message,
        });
    }
};


// Admin sets or updates a teacher's fixed monthly salary
const updateTeacherSalary = async (req, res) => {
    try {
        const { monthlySalary } = req.body;

        if (
            typeof monthlySalary !== "number" ||
            !Number.isFinite(monthlySalary) ||
            monthlySalary <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Monthly salary must be a positive number",
            });
        }

        const teacher = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "teacher",
            },
            {
                $set: { monthlySalary },
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Teacher's fixed monthly salary updated successfully",
            data: teacher,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update teacher salary",
            error: error.message,
        });
    }
};


module.exports = {
    getAllTeachers,
    getTeacherById,
    updateTeacherSalary,
};