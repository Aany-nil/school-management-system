const mongoose = require("mongoose");


const subjectSchema = new mongoose.Schema({

    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "creator id is required"]
    },

    subjectName: {
        type: String,
        required: [true, "subject is required"],
        trim: true,
    },

    subjectCode: {
        type: String,
        required:[true, "subject code is required"],
        unique: true,
        uppercase: true,
        trim: true,
    },

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: [true, "class is required"]
    },

    description: {
        type: String,
        default: false,
    }

},
    { 
        timestamps: true,
    }
);


module.exports = mongoose.model("Subject", subjectSchema);