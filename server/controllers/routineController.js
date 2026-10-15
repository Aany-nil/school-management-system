const createRoutine = async (req, res) => {
    try {
        const { classId, subjectId, teacherId, day, startTime, endTime } = req.body;

        if(!classId || !subjectId || !teacherId || !day || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "classId, subjectId, teacherId, day, startTime and endTime are required"
            });
        }

    
        
    } catch (error) {
        
    }
}




module.exports = {
    createRoutine,
}