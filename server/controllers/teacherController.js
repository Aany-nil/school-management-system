const User = require("../models/User");

const getAllTeachers = async (req, res) => {

    try {
      const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        message: "teacher retrieve successfully",
        count: teachers.length,
        data: teachers,
      });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "teacher retrieve to failed",
            error: error.message
        });
        
    }
}

const getTeacherById = async (req, res) => {

    try {
     const teacher = await User.findOne({
        _id: req.params.id,
        role: "teacher",
     }).select("-password");

     if(!teacher) {
        return res.status(404).json({
            success: false,
            message: "teacher not found"
        });
     }

     return res.status(200).json({
        success: true,
        message: "teacher retrieve successfully",
        data: teacher,
     });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "teacher retrieve to failed",
            error: error.message
        });
        
    }
}
module.exports = {
    getAllTeachers,
    getTeacherById,
}