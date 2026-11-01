
const mongoose = require("mongoose");
const Class = require("../models/Class");
const User = require("../models/User");



const createClass = async (req, res) => {
    try {
        const {
            className,
            section,
            academicYear,
            teacherId
        } = req.body;


        if (!className || !section || !academicYear || !teacherId) {
            return res.status(400).json({
                success: false,
                message: "Class name, section, academic year and teacher are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID"
            });
        }

        // Check teacher exists
        const teacher = await User.findOne({
            _id: teacherId,
            role: "teacher"
        });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        // Create class
        const newClass = await Class.create({
            className: className.trim(),
            section: section.trim(),
            academicYear,
            teacherId
        });

        const classData = await Class.findById(newClass._id)
            .populate("teacherId", "name email");

        return res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: classData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create class",
            error: error.message
        });
    }
};


const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate("teacherId", "name email")
            .sort({ className: 1 });

        return res.status(200).json({
            success: true,
            total: classes.length,
            data: classes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get classes",
            error: error.message
        });
    }
};


const getSingleClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate class ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const classData = await Class.findById(id)
            .populate("teacherId", "name email");

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Class retrieved successfully",
            data: classData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve class",
            error: error.message
        });
    }
};


const updateClass = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const {
            className,
            section,
            academicYear,
            teacherId
        } = req.body;

        if (teacherId !== undefined) {

            if (!mongoose.Types.ObjectId.isValid(teacherId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid teacher ID"
                });
            }

            const teacher = await User.findOne({
                _id: teacherId,
                role: "teacher"
            });

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found"
                });
            }
        }

        const updateData = {};

        if (className !== undefined) {
            updateData.className = className.trim();
        }

        if (section !== undefined) {
            updateData.section = section.trim();
        }

        if (academicYear !== undefined) {
            updateData.academicYear = academicYear;
        }

        if (teacherId !== undefined) {
            updateData.teacherId = teacherId;
        }

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        ).populate("teacherId", "name email");

        if (!updatedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Class updated successfully",
            data: updatedClass
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update class",
            error: error.message
        });
    }
};


const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate class ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Class deleted successfully",
            data: deletedClass
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete class",
            error: error.message
        });
    }
};


module.exports = {
    createClass,
    getAllClasses,
    getSingleClass,
    updateClass,
    deleteClass
};
