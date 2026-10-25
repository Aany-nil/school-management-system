const mongoose = require("mongoose");
const Result = require("../models/Result");


const createResult = async (req, res) => {
    try {
        const {
            studentId,
            classId,
            subjectId,
            examName,
            marks,
            totalMarks,
            grade,
        } = req.body;

        if(
            !studentId 
            || !classId 
            || !subjectId 
            || !examName 
            || !marks 
            || !totalMarks 
            || !grade) {
            
            return res.status(400).json({
                success: false,
                message: "all required fields must be provided"
            });

        }

    if(
       !mongoose.Types.ObjectId.isValid(studentId)
    || !mongoose.Types.ObjectId.isValid(classId)
    || !mongoose.Types.ObjectId.isValid(subjectId)
     
     ) {
        return res.status(400).json({
            success: false,
            message: "invalid student, subject or student id"
        });

   }

   const result = await Result.create({
      studentId,
      classId,
      subjectId,
      examName,
      marks,
      totalMarks,
      grade,
   });

   return res.status(201).json({
    success: true,
    message: "result created successfully",
    data: result
   });

    } catch (error) {
    return res.status(500).json({
        success: false,
        message: "result create to failed",
        error: error.message
    });

    }
}


const getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
        .populate("studentId", "name email")
        .populate("classId")
        .populate("subjectId")

    return res.status(200).json({
        success: true,
        count: results.length,
        message: "all result are retrieve successfully",
        data: results,
    });
    } catch (error) {
    return res.status(500).json({
        success: false,
        message: "all result retrieve to failed",
        error: error.message
    });
        
    }
}

const getStudentResult = async (req, res) => {
    try {
        const { studentId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(studentId)) {
          
         return res.status(400).json({
            success: false,
            message: "invalid student id",
         });
        }

        if(
            req.user.role === "student" &&
            req.user._id.toString() !== studentId
        ) {
            return res.status(403).json({
                success: false,
                message: "you can view only your own results"
            });
        }

        const studentResults = await Result.find({ studentId })
        .populate("studentId", "name email")
        .populate("classId")
        .populate("subjectId")

        return res.status(200).json({
            success: true,
            count: studentResults.length,
            data: studentResults,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "student results retrieve to failed",
            error: error.message
        });
    }
}


const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid result id"
            });
        }

        const results = await Result.findByIdAndUpdate(id, req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        )

        if(!results) {
            return res.status(400).json({
                success: false,
                message: "results not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "results update is successfully",
            data: results,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "results update to failed",
            error: error.message
        });
        
    }
}

const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid result id"
            })
        }
        const deletedResult = await Result.findByIdAndDelete(id);

        if(!deletedResult) {
            return res.status(404).json({
                success: false,
                message: "result is not found"

            });
        }
        return res.status(200).json({
            success: true,
            message: "result deleted successfully",
            data: deletedResult,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to result delete",
            error: error.message
        });
        
    }
}



module.exports = {
    createResult,
    getAllResults,
    getStudentResult,
    updateResult,
    deleteResult
}