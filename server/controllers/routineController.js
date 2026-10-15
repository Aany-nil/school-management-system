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




module.exports = {
    createRoutine,
}