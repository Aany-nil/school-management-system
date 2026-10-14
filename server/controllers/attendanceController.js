const mongoose = require("mongoose");
const User = require("../models/User");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");

const createAttendance = async (req, res) => {

    try {
       const { student, classId, date, status, remarks } = req.body;

       if(!student || !classId || !date || !status ) {

        return res.status(400).json({
            success: false,
            message: "student, classId, date and status are required"
        });
       }

       if(
        !mongoose.Types.ObjectId.isValid(student) ||
        !mongoose.Types.ObjectId.isValid(classId)) {
       
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

       const existingStudent = await User.findOne({
        _id: student,
        role: "student"
       });

       if(!existingStudent) {
        return res.status(404).json({
            success: false,
            message: "student not found"
        });
       }

       const existingClass = await Class.findById(classId);

       if(!existingClass) {
        return res.status(404).json({
            success: false,
            message: "class not found"
        });
       }

       const existingAttendance = await Attendance.findOne({
        student,
        classId,
        date: new Date(date)
       });

       if(existingAttendance) {

        return res.status(409).json({

            success: false,
            message: "attendance already exists"
        });
       }

       const attendance = await Attendance.create({
         student,
         classId,
         date: new Date(date),
         status,
         remarks

       });

      return res.status(201).json({
        success: true,
        message: "attendance created successfully",
        data: attendance
      });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "attendance create retrieve to failed",
            error: error.message
        });

    }
}


module.exports = {
    createAttendance,
}