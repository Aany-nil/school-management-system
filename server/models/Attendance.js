const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    date: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        required: true,
        default: "Present"
    },

    remarks: {
        type: String,
        require: true,
        default: ""
    }
   
},
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Attendance", attendanceSchema);