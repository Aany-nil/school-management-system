
const mongoose = require("mongoose");
const Class = require("../models/Class");
const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
    try {
        const { creatorId,subjectName, subjectCode, classId, description } = req.body;

        if(!creatorId ||!subjectName ||!subjectCode ||!classId) {
            return res.status(404).json({
                success: false,
                message: "creator id, subject name, subject code and class id are required"
            });
        }

        if(!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                success: false,
                message: "invalid class id"
            });
        }

        const existingClass = await Class.findById(classId);

        if(!existingClass) {
            return res.status(404).json({
                success: false,
                message: "class not found"
            });
        }

        const existingSubject = await Subject.exists({
            subjectCode: subjectCode.trim().toUpperCase(),
            classId
        });

        if(existingSubject) {
            return res.status(400).json({
                success: false,
                message: "subject code already exists in this code"
            })
        }

        const subject = await Subject.create({
            creatorId,
            subjectName: subjectName.trim(),
            subjectCode: subjectCode.trim(),
            classId,
            description,
        });

        return res.status(201).json({
            success: true,
            message: "subject created successfully",
            data: subject
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "subject created to failed",
            error: error.message
        });
        
    }
}


const getAllSubject = async (req, res) => {
    try {
        const subject = await Subject.find()
        .populate("classId", "className section academicYear")
        .sort({ subjectName: 1 });

        return res.status(200).json({
            success: true,
            total: subject.length,
            data: subject
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to retrieve subject",
            error: error.message
        });
        
    }
}

const getSingleSubject = async (req, res) => {

    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "invalid subject id"
            })
        }

        const subject = await Subject.findById(id)
        .populate("classId", "clasName section academicYear");

        if(!subject) {
            return res.status(404).json({
                success: false,
                message: "subject not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "subject retrieve successfully",
            data: subject
        });
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to retrieve subject",
            error: error.message
        });
        
    }
}

const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid subject id"
            });
        }

        const subject = await Subject.findById(id);

        if(!subject) {
            return res.status(404).json({
                success: false,
                message: "subject not found"
            });
        }

        const { subjectName, subjectCode, classId, description } = req.body;

        if(classId !==undefined) {
            if(!mongoose.Types.ObjectId.isValid(classId)) {
                return res.status(400).json({
                    success: false,
                    message: "invalid class id"
                });
            }
            const existingClass = await Class.findById(classId);

            if(!existingClass) {
                return res.status(404).json({
                    success: false,
                    message: "class not found"
                });
            }
        }

     const newCode = subjectCode === undefined
     ? subject.subjectCode
     : subjectCode.trim().toUpperCase();

    const newClassId = classId === undefined
    ? subject.classId
    : classId;

    const duplicateSubject = await Subject.exists({
        subjectCode: newCode,
        classId: newClassId,
        _id: { $ne: id }
    });

    if(duplicateSubject) {
        return res.status(409).json({
            success: false,
            message: "the subject code already exists in this class"
        });
    }

    if(subjectName !== undefined) {
        subject.subjectName = subjectName.trim();
    }
    if(subjectCode !== undefined) {
        subject.subjectCode = subjectCode.trim().toUpperCase();
    }
    if(classId !== undefined) {
        subject.classId = classId;
    }
    if(!description !== undefined) {
        subject.description = description;
    }

    await subject.save();

    const updateSubject = await Subject.findById(id)
    .populate("classId", "className section academicYear");

    return res.status(200).json({
        success: true,
        message: "subject update successfully",
        data: updateSubject
    });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to update subject",
            error: error.message
        });
        
    }
}


module.exports = {
    createSubject,
    getAllSubject,
    getSingleSubject,
    updateSubject,
}