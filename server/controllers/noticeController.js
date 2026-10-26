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

const getNoticeById = async (req, res) => {

    try {
        const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "invalid notice id"
        });
    }

    const role = req.user.role;
    const filter = {

      _id: id,
      ...(role === "admin"
        ? {}
        : { targetRole: { $in: ["all", role] } }),
    };

    const notice = await Notice.findOne(filter)
    .populate("createdBy", "name email");

    if(!notice) {
        return res.status(404).json({
            success: false,
            message: "notice not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "notice retrieve successfully",
        data: notice,
    });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "notice retrieve to failed",
            error: error.message
        });
        
    }

}


const updateNotice = async (req, res) => {

    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid notice id"
            });
        }

        const noticeUpdate = [
            "title",
            "description",
            "targetRole",
            "publishDate"
        ];

        const updates = {}

        for (const field of noticeUpdate) {
            if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
             }
     }

     const notice = await Notice.findByIdAndUpdate(id, updates, {

         returnDocument: "after",
         runValidators: true,
      });

      if(!notice) {
        return res.status(404).json({
            success: false,
            message: "notice not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "notice update successfully",
        data: notice,
      });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "notice update to failed",
            error: error.message
        });
        
    }
}

const deleteNotice = async (req, res) => {

    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
               success: false,
               message: "invalid notice id"
            });
        }

        const deletedNotice = await Notice.findByIdAndDelete(id);

        if(!deletedNotice) {
            return res.status(404).json({
                success: false,
                message: "notice not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "notice deleted successfully",
            data: deletedNotice,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "notice deleted to failed",
            error: error.message
        });
        
    }
}



module.exports = {
    createNotice,
    getAllNotice,
    getNoticeById,
    updateNotice,
    deleteNotice
}