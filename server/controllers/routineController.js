const mongoose = require("mongoose");
const Routine = require("../models/Routine");

const createRoutine = async (req, res) => {
    try {
        const { classId, subjectId, teacherId, day, startTime, endTime } = req.body;

        if(!classId || !subjectId || !teacherId || !day || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "classId, subjectId, teacherId, day, startTime and endTime are required"
            });
        }

        if(
            !mongoose.Types.ObjectId.isValid(classId) || 
            !mongoose.Types.ObjectId.isValid(subjectId) ||
            !mongoose.Types.ObjectId.isValid(teacherId)
        ) {
            return res.status(404).json({
                success: false,
                message: "invalid classId, subjectId and teacherId"
            });
        }  
        
        const routine = await Routine.create({
            classId,
            subjectId,
            teacherId,
            day,
            startTime,
            endTime
        });

        return res.status(201).json({
            success: true,
            message: "routine created successfully",
            data: routine
        });
     } catch (error) {
        return res.status(500).json({
            success: false,
            message: "routine created to failed",
            error: error.message
        });
        
    }
}


const getAllRoutine = async (req, res) => {

    try {
        const routines = await Routine.find()
        .populate("classId", "className section")
        .populate("subjectId", "subjectName, subjectCode")
        .populate("teacherId", "name email");

        return res.status(200).json({
            success: true,
            total: routines.length,
            data: routines
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to get routines",
            error: error.message
        });
        
    }
}

const getSingleRoutine = async (req, res) => {

    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid routine id"
            });
        }

        const routine = await Routine.findById(id)
        .populate("classId", "className section")
        .populate("subjectId", "subjectName subjectCode")
        .populate("teacherId", "name email");

        if(!routine) {
            return res.status(404).json({
               success: false,
               message: "routine not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "routine retrieve successfully",
            data: routine
        });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "routine retrieve to failed",
            error: error.message
        });
        
    }
}






module.exports = {
    createRoutine,
    getAllRoutine,
    getSingleRoutine,
}