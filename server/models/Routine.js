const mongoose = require("mongoose");

const routineSchema = mongoose.Schema({

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: [true, "class is required"]
    },

    subjectId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Subject",
         required: [true, "subject is required"]
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "teacher is required"]
    },
    day: {
        type: String,
        enum: [
            "saturday",
            "sunday", 
            "monday", 
            "tuesday", 
            "wednesday", 
            "thursday", 
            "friday"
        ],
        required: true

    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }

},
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Routine", routineSchema);