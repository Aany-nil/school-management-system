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


const getAllAttendance = async (req, res) => {

    try {
        const { classId, student, date } = req.query;

        const filter = {};

        if(classId) {
            
            filter.classId = classId;
        }

        if(student) {
            filter.student = student;
        }

       if (date) {
              const startDate = new Date(`${date}T00:00:00.000Z`);
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 1); 

        filter.date = {
        $gte: startDate,$lt: endDate

        };
      }
        const attendance = await Attendance.find(filter)

        .populate("student", "name email")
        .populate("classId", "className section")
        .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            total: attendance.length,
            data: attendance
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed ot all attendance get",
            error: error.message
        });
        
    }
}

const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const attendance = await Attendance.findById(id);

        if(!attendance) {
            return res.status(404).json({
                success: false,
                message: "attendance not found"
            });
        }

        if(status) {
            attendance.status = status;
        }

        if(remarks !== undefined) {
            attendance.remarks = remarks;
        }

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: "attendance update successfully",
            data: attendance
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "attendance update to failed",
            error: error.message
        });
        
    }
}

const deleteAttendance = async (req, res) => {

    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid attendance id"
            });
        }

        const attendance = await Attendance.findByIdAndDelete(id);

        if(!attendance) {
            return res.status(404).json({
                success: false,
                message: "attendance not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "attendance deleted successfully"
        });
               
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "attendance deleted to failed",
            error: error.message
        });
        
    }
}

const getMyAttendance = async (req, res) => {

    try {
        const attendance = await Attendance.find({

           student: req.user._id
        }).populate("classId", "className section academicYear").sort({ date: -1 });

        return res.status(200).json({
            success: true,
            total: attendance.length,
            data: attendance
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to get your attendance",
            error: error.message

        });
        
    }
}


module.exports = {
    createAttendance,
    getAllAttendance,
    updateAttendance,
    deleteAttendance,
    getMyAttendance
}