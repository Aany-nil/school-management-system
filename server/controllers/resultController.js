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



module.exports = {
    createResult,
}