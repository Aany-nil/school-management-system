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

attendanceSchema.index(
    { student: 1, classId: 1, data: 1 },
    { unique: true }
);


module.exports = mongoose.model("Attendance", attendanceSchema);