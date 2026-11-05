
const mongoose = require("mongoose");
const Routine = require("../models/Routine");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const User = require("../models/User");



const populateRoutine = (query) => {
    return query
        .populate("classId", "className section academicYear")
        .populate("subjectId", "subjectName subjectCode")
        .populate("teacherId", "name email");
}

const createRoutine = async (req, res) => {
    try {
        const { classId, subjectId, teacherId, day, startTime, endTime } = req.body;

        if (!classId || !subjectId || !teacherId || !day || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "classId, subjectId, teacherId, day, startTime and endTime are required"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(classId) ||
            !mongoose.Types.ObjectId.isValid(subjectId) ||
            !mongoose.Types.ObjectId.isValid(teacherId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class, subject or teacher ID"
            });
        }

        const selectedClass = await Class.findById(classId);
        const selectedSubject = await Subject.findById(subjectId);
        const selectedTeacher = await User.findById(teacherId);

        if (!selectedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        if (!selectedSubject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        if (!selectedTeacher || selectedTeacher.role !== "teacher") {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        if (selectedSubject.classId.toString() !== classId) {
            return res.status(400).json({
                success: false,
                message: "Selected subject does not belong to this class"
            });
        }

        if (!selectedClass.teacherId ||
            selectedClass.teacherId.toString() !== teacherId) {
            return res.status(400).json({
                success: false,
                message: "Selected teacher is not assigned to this class"
            });
        }

        const routine = await Routine.create({
            classId,
            subjectId,
            teacherId,
            day: day.toLowerCase(),
            startTime,
            endTime
        });

        const populatedRoutine = await populateRoutine(
            Routine.findById(routine._id)
        );

        return res.status(201).json({
            success: true,
            message: "Routine created successfully",
            data: populatedRoutine
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create routine",
            error: error.message
        });
    }
};


const getAllRoutine = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let filter = {};

        if (role === "admin") {
            filter = {};
        }

        else if (role === "teacher") {
            const teacherClasses = await Class.find({
                teacherId: userId
            }).select("_id");

            const classIds = teacherClasses.map(item => item._id);

            if (classIds.length === 0) {
                return res.status(200).json({
                    success: true,
                    total: 0,
                    message: "No class has been assigned to you yet",
                    data: []
                });
            }

            filter = {
                classId: { $in: classIds }
            };
        }

        else if (role === "student") {
            const student = await User.findOne({
                _id: userId,
                role: "student"
            }).select("classId");

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                });
            }

            if (!student.classId) {
                return res.status(200).json({
                    success: true,
                    total: 0,
                    message: "No class has been assigned to you yet",
                    data: []
                });
            }

            filter = {
                classId: student.classId
            };
        }

        else {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to view routines"
            });
        }

        const routines = await populateRoutine(
            Routine.find(filter).sort({ day: 1, startTime: 1 })
        );

        return res.status(200).json({
            success: true,
            total: routines.length,
            message: "Routines retrieved successfully",
            data: routines
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve routines",
            error: error.message
        });
    }
};


const getSingleRoutine = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid routine ID"
            });
        }

        const routine = await populateRoutine(Routine.findById(id));

        if (!routine) {
            return res.status(404).json({
                success: false,
                message: "Routine not found"
            });
        }

        // Teacher can only view routines of assigned classes
        if (req.user.role === "teacher") {
            const assignedClass = await Class.findOne({
                _id: routine.classId._id,
                teacherId: req.user._id
            });

            if (!assignedClass) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot access this routine"
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Routine retrieved successfully",
            data: routine
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve routine",
            error: error.message
        });
    }
};


const updateRoutine = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid routine ID"
            });
        }

        const existingRoutine = await Routine.findById(id);

        if (!existingRoutine) {
            return res.status(404).json({
                success: false,
                message: "Routine not found"
            });
        }

        const allowedFields = [
            "classId",
            "subjectId",
            "teacherId",
            "day",
            "startTime",
            "endTime"
        ];

        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        const classId = updates.classId || existingRoutine.classId;
        const subjectId = updates.subjectId || existingRoutine.subjectId;
        const teacherId = updates.teacherId || existingRoutine.teacherId;

        if (
            !mongoose.Types.ObjectId.isValid(classId) ||
            !mongoose.Types.ObjectId.isValid(subjectId) ||
            !mongoose.Types.ObjectId.isValid(teacherId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid class, subject or teacher ID"
            });
        }

        const selectedClass = await Class.findById(classId);
        const selectedSubject = await Subject.findById(subjectId);
        const selectedTeacher = await User.findById(teacherId);

        if (!selectedClass || !selectedSubject ||
            !selectedTeacher || selectedTeacher.role !== "teacher") {
            return res.status(400).json({
                success: false,
                message: "Invalid class, subject or teacher"
            });
        }

        if (selectedSubject.classId.toString() !== classId) {
            return res.status(400).json({
                success: false,
                message: "Selected subject does not belong to this class"
            });
        }

        if (!selectedClass.teacherId ||
            selectedClass.teacherId.toString() !== teacherId) {
            return res.status(400).json({
                success: false,
                message: "Selected teacher is not assigned to this class"
            });
        }

        if (updates.day) {
            updates.day = updates.day.toLowerCase();
        }

        const updatedRoutine = await Routine.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        const populatedRoutine = await populateRoutine(
            Routine.findById(updatedRoutine._id)
        );

        return res.status(200).json({
            success: true,
            message: "Routine updated successfully",
            data: populatedRoutine
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update routine",
            error: error.message
        });
    }
};


const deleteRoutine = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid routine ID"
            });
        }

        const routine = await Routine.findByIdAndDelete(id);

        if (!routine) {
            return res.status(404).json({
                success: false,
                message: "Routine not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Routine deleted successfully",
            data: routine
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete routine",
            error: error.message
        });
    }
};


const getMyRoutine = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const teacherClasses = await Class.find({
            teacherId
        }).select("_id");

        const classIds = teacherClasses.map(item => item._id);

        if (classIds.length === 0) {
            return res.status(200).json({
                success: true,
                total: 0,
                message: "No class has been assigned to you yet",
                data: []
            });
        }

        const routines = await populateRoutine(
            Routine.find({
                teacherId,
                classId: { $in: classIds }
            }).sort({ day: 1, startTime: 1 })
        );

        return res.status(200).json({
            success: true,
            total: routines.length,
            message: "My routines retrieved successfully",
            data: routines
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve my routines",
            error: error.message
        });
    }
};


module.exports = {
    createRoutine,
    getAllRoutine,
    getSingleRoutine,
    updateRoutine,
    deleteRoutine,
    getMyRoutine
};
