const mongoose = require("mongoose");


const noticeSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "notice title is required"],
        trim: true,
        maxlength: [100, "notice title cannot exceed 100 characters"]
    },

    description: {
        type: String,
        required: [true, "description is required"],
        trim: true

    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    targetRole: {
        type: String,
        enum: ["all", "teacher", "student"],
        default: "all"
    },

    publishDate: {
        type: Date,
        default: Date.now
    }

},
   {
     timestamps: true
   }
);



module.exports = mongoose.model("Notice", noticeSchema);