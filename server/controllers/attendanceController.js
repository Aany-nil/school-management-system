
const mongoose = require("mongoose");
const User = require("../models/User");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");



const createAttendance = async (req, res) => {
    try {
        const { student, classId, date, status, remarks } = req.body;

        if (!student || !classId || !date || !status) {
            return res.status(400).json({
                success: false,
                message: "student, classId, date and status are required",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(student) ||
            !mongoose.Types.ObjectId.isValid(classId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID or class ID",
            });
        }

        if (!["Present", "Absent", "Late"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance status",
            });
        }

        const attendanceDate = new Date(date);

        if (Number.isNaN(attendanceDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance date",
            });
        }

        const existingStudent = await User.findOne({
            _id: student,
            role: "student",
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const existingClass = await Class.findById(classId);

        if (!existingClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found",
            });
        }

        
        if (
            !existingStudent.classId ||
            existingStudent.classId.toString() !== classId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Student does not belong to this class",
            });
        }


        if (req.user.role === "teacher") {
            if (
                !existingClass.teacherId ||
                existingClass.teacherId.toString() !== req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You are not assigned to this class",
                });
            }
        }

        
        const existingAttendance = await Attendance.findOne({
            student,
            classId,
            date: attendanceDate,
        });

        if (existingAttendance) {
            return res.status(409).json({
                success: false,
                message: "Attendance already exists",
            });
        }

        const attendance = await Attendance.create({
            student,
            classId,
            date: attendanceDate,
            status,
            remarks: remarks || "",
        });

        return res.status(201).json({
            success: true,
            message: "Attendance created successfully",
            data: attendance,
        });

    } catch (error) {
        console.error("CREATE ATTENDANCE ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Attendance already exists for this student and date",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create attendance",
            error: error.message,
        });
    }
};



const getAllAttendance = async (req, res) => {
    try {
        const { classId, student, date } = req.query;

        const filter = {};

        if (classId) {
            if (!mongoose.Types.ObjectId.isValid(classId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid class ID",
                });
            }

            filter.classId = classId;
        }

        if (student) {
            if (!mongoose.Types.ObjectId.isValid(student)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID",
                });
            }

            filter.student = student;
        }

        if (date) {
            const startDate = new Date(`${date}T00:00:00.000Z`);

            if (Number.isNaN(startDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date",
                });
            }

            const endDate = new Date(startDate);
            endDate.setUTCDate(endDate.getUTCDate() + 1);

            filter.date = {
                $gte: startDate,
                $lt: endDate,
            };
        }

    
        if (req.user.role === "teacher") {
            const teacherClasses = await Class.find({
                teacherId: req.user._id,
            }).select("_id");

            const teacherClassIds = teacherClasses.map(
                (item) => item._id
            );

            if (classId) {
                const isAssigned = teacherClassIds.some(
                    (id) => id.toString() === classId.toString()
                );

                if (!isAssigned) {
                    return res.status(403).json({
                        success: false,
                        message: "You are not assigned to this class",
                    });
                }
            } else {
                filter.classId = {
                    $in: teacherClassIds,
                };
            }
        }

        const attendance = await Attendance.find(filter)
            .populate("student", "name email")
            .populate("classId", "className section academicYear")
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            total: attendance.length,
            data: attendance,
        });

    } catch (error) {
        console.error("GET ALL ATTENDANCE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get attendance",
            error: error.message,
        });
    }
};


const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        if (
            status !== undefined &&
            !["Present", "Absent", "Late"].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance status",
            });
        }

        const attendance = await Attendance.findById(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found",
            });
        }

    
        if (req.user.role === "teacher") {
            const assignedClass = await Class.findOne({
                _id: attendance.classId,
                teacherId: req.user._id,
            });

            if (!assignedClass) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to update this attendance",
                });
            }
        }

        if (status !== undefined) {
            attendance.status = status;
        }

        if (remarks !== undefined) {
            attendance.remarks = remarks;
        }

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            data: attendance,
        });

    } catch (error) {
        console.error("UPDATE ATTENDANCE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update attendance",
            error: error.message,
        });
    }
};



const deleteAttendance = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete attendance",
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID",
            });
        }

        const attendance = await Attendance.findByIdAndDelete(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Attendance deleted successfully",
            data: attendance,
        });

    } catch (error) {
        console.error("DELETE ATTENDANCE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete attendance",
            error: error.message,
        });
    }
};


const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({
            student: req.user._id,
        })
            .populate("classId", "className section academicYear")
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            total: attendance.length,
            data: attendance,
        });

    } catch (error) {
        console.error("GET MY ATTENDANCE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get your attendance",
            error: error.message,
        });
    }
};


const getClassStudents = async (req, res) => {
    try {
        const { classId } = req.query;

        if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                success: false,
                message: "Valid classId is required",
            });
        }

        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found",
            });
        }

  
        if (req.user.role === "teacher") {
            if (
                !classData.teacherId ||
                classData.teacherId.toString() !== req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You are not assigned to this class",
                });
            }
        }

        const students = await User.find({
            role: "student",
            classId: classId,
        })
            .select("name email profilePicture classId")
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            total: students.length,
            data: students,
        });

    } catch (error) {
        console.error("GET CLASS STUDENTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get class students",
            error: error.message,
        });
    }
};


module.exports = {
    createAttendance,
    getAllAttendance,
    updateAttendance,
    deleteAttendance,
    getMyAttendance,
    getClassStudents,
};
