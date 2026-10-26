const Notice = require("../models/Notice");
const mongoose = require("mongoose");

const createNotice = async (req, res) => {

    try {

        const { title, description, targetRole, publishDate } = req.body;

        if(!title || !description) {
            res.status(400).json({
                success: false,
                message: "title & description are required"
            })
        }

        const notice = await Notice.create({
            title,
            description,
            targetRole: targetRole || "all",
            publishDate: publishDate || Date.now(),
            createdBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "notice created successfully",
            data: notice
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "notice created to failed",
            error: error.message
        });
        
    }
}


const getAllNotice = async (req, res) => {

    try {

     const role = req.user.role;

     const filter =
            role === "admin"
                       ? {}
                       : { targetRole: { $in: ["all", role] } };


     const notices = await Notice.find(filter)
     .populate("createdBy", "name email")
     .sort({ publishDate: -1 });

     
     return res.status(200).json({
        success: true,
        message: "notice retrieve successfully",
        count: notices.length,
        data: notices
     });
     
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "notice retrieve to failed",
            error: error.message
        });
        
    }
}



module.exports = {
    createNotice,
    getAllNotice,
}