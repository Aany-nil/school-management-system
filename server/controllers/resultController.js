const mongoose = require("mongoose");
const Result = require("../models/Result");
const User = require("../models/User");
const Class = require("../models/Class");
const Subject = require("../models/Subject");


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

    if (
      !studentId ||
      !classId ||
      !subjectId ||
      !examName?.trim() ||
      marks === undefined ||
      marks === null ||
      totalMarks === undefined ||
      totalMarks === null
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // 2. ObjectId validation
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(classId) ||
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student, class or subject ID",
      });
    }

    const obtainedMarks = Number(marks);
    const maximumMarks = Number(totalMarks);

    if (
      !Number.isFinite(obtainedMarks) ||
      !Number.isFinite(maximumMarks) ||
      obtainedMarks < 0 ||
      maximumMarks < 1 ||
      obtainedMarks > maximumMarks
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid marks information",
      });
    }


    const student = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    
    const selectedClass = await Class.findById(classId);

    if (!selectedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }


    if (
      !student.classId ||
      student.classId.toString() !== classId
    ) {
      return res.status(400).json({
        success: false,
        message: "Student does not belong to this class",
      });
    }


    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }


    if (subject.classId.toString() !== classId) {
      return res.status(400).json({
        success: false,
        message: "Subject does not belong to this class",
      });
    }


    if (req.user.role === "teacher") {
      if (
        selectedClass.teacherId.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can create results only for your assigned classes",
        });
      }
    }


    const result = await Result.create({
      studentId,
      classId,
      subjectId,
      examName: examName.trim(),
      marks: obtainedMarks,
      totalMarks: maximumMarks,
      grade: grade || "",
    });

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Result creation failed",
      error: error.message,
    });
  }
};


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

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }


    if (
      req.user.role === "student" &&
      req.user._id.toString() !== studentId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can view only your own results",
      });
    }


    if (req.user.role === "teacher") {
      const assignedClass = await Class.findOne({
        _id: student.classId,
        teacherId: req.user._id,
      });

      if (!assignedClass) {
        return res.status(403).json({
          success: false,
          message: "You cannot view this student's results",
        });
      }
    }

    const studentResults = await Result.find({
      studentId,
      classId: student.classId,
    })
      .populate("studentId", "name email")
      .populate("classId")
      .populate("subjectId");

    return res.status(200).json({
      success: true,
      count: studentResults.length,
      data: studentResults,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Student results retrieval failed",
      error: error.message,
    });
  }
};

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