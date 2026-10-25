const User = require("../models/User")

const getAllStudents = async (req, res) => {

    try {
      const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "students retrieve successfully",
        count: students.length,
        data: students,
      });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to retrieve students",
            error: error.message
        });
        
    }
}

const getStudentById = async (req, res) => {

    try {
        const student = await User.findOne({
             _id: req.params.id,
            role: "student"
        }).select("-password");

        if(!student) {
            return res.status(404).json({
                success: false,
                message: "student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "student retrieve successfully",
            data: student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "student retrieve to failed",
            error: error.message
        });
        
    }
}


module.exports = {
    getAllStudents,
    getStudentById,
}