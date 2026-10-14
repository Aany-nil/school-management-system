const mongoose = require("mongoose");

const createAttendance = async (req, res) => {

    try {
       const { student, classId, date, status, remarks } = req.body;

       if(!student || !classId || !date || !status || !remarks) {

        return res.status(400).json({
            success: false,
            message: "student, classId, date and status are required"
        });
       }

       if(
        !mongoose.Schema.Types.ObjectId.isValid(student) ||
        !mongoose.Schema.Types.ObjectId.isValid(classId)) {
       
        return res.status(404).json({
            success: false,
            message: "invalid student id and class id"
        });

       }

       if(!["Present", "Absent", "Late"].includes(status)) {

        return res.status(404).json({
            success: false,
            message: "invalid attendance status"
        })
       }

    } catch (error) {

    }
}


module.exports = {
    createAttendance,
}