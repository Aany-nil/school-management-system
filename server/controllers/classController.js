const Class = require("../models/Class");

const createClass = async (req, res) => {
    try {
        const { className, section, academicYear } = req.body;
        
        if(!className || !section || !academicYear) {
            return res.status(400).json({
                success: false,
                message: "class name, section, and academic year are required"
            });
        }

        const newClass = await Class.create({
            className,
            section,
            academicYear,
        });

        return res.status(201).json({
            success: true,
            message: "class created successfully",
            data: newClass,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "class created to failed",
            error: error.message
        });
    }
}

const getAllClasses = async (req, res) => {
    try {
       const classes = await Class.find().sort({ className: 1 });
       
       return res.status(200).json({
        success: true,
        total: classes.length,
        data: classes,
       });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to get classes",
            error: error.message
        });
    }
}


const getSingleClass = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id);

        if(!classData) {
            return res.status(404).json({
                success: false,
                message: "class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "class retrieve successfully",
            data: classData,

        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "class retrieve to failed",
            error: error.message
        });
    }
}

const updateClass = async (req, res) => {

    try {
        const updatedClass = await Class.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, 
                runValidators: true,
            }
        );

        if(!updatedClass) {
            return res.status(404).json({
                success: false,
                message: "class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "class updated successfully",
            data: updatedClass,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to update class",
            error: error.message
        });
    }
}

const deleteClass = async (req, res) => {
    try {

        const deletedClass = await Class.findByIdAndDelete(
            req.params.id
        );

        if(!deletedClass) {
            return res.status(404).json({
                success: false,
                message: "class not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "class deleted successfully",
            data: deletedClass,
        });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "class deleted to failed",
            error: error.message
        });
        
    }
}


module.exports = { 
    createClass,
    getAllClasses,
    getSingleClass,
    updateClass,
    deleteClass
}