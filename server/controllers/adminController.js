const User = require("../models/User");

function formatUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
    };
}

const getTeachers = async (req, res) => {
    try {
       const teachers = await User.find({
         role: "teacher"
       }).sort({ createdAt: -1 });

       return res.status(200).json({
        success: true,
        message: "teacher retrive successfully",
        data: {
            teachers: teachers.map(formatUser),
            count: teachers.length,
        }
       });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "teacher retrive failed",
            error: error.message
        });    
    }
}

const getStudents = async (req, res) => {
    try {

        const students = await User.find({
            role: "student"
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "student retrive successfully",
            data: {
                students: students.map(formatUser),
                count: students.length,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "student retrive failed",
            error: message.error
        });
        
    }
}

const getAllUsers = async (req, res) => {
    try {
       const { role } = req.query;
       const filter = {};
       if(role && ["admin", "teacher", "student"].includes(role)) {
        filter.role = role
       }

       const users = await User.find(filter).sort({ createdAt: -1 });

       return res.status(200).json({
        success: true,
        message: "users retrived successfully",
        data: {
            users: users.map(formatUser),
            count: users.length,
        }
       })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "users retrive falied",
            error: error.message
        });
        
    }
}

const getStudentById = async (req, res) => {
    try {
      const studentInfo = await User.findById(req.params.id);

      if(!studentInfo) {
        return res.status(404).json({
            success: false,
            message: "student not found",
        })
      }

       return res.status(200).json({
        success: true,
        message: "student retrived successfully",
        data: formatUser(studentInfo),
       });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "student retrive falied",
        error: error.message
      });  
    }
}

const getTeacherById = async (req, res) => {
    try {
        const teacherInfo = await User.findById(req.params.id);

        if(!teacherInfo) {
            return res.status(404).json({
                success: false,
                message: "teacher not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "teacher retrieve successfully",
            data: formatUser(teacherInfo),
        });
    } catch (error) {
       return res.status(500).json({
        success: false,
        message: "teacher retrive failed",
        error: error.message
       }); 
    }
}


module.exports = { 
    getTeachers, 
    getStudents, 
    getAllUsers, 
    getStudentById,
    getTeacherById,
 }