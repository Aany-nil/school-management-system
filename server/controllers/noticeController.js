const Notice = require("../models/Notice");

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


module.exports = {
    createNotice,
}