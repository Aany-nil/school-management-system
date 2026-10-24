const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    studentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        require: true,
    },
    examName: {
        type: String,
        required: true,
        trim: true,
    },
    marks: {
        type: Number,
        required: true,
        min: 0
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 1,
    },
    grade: {
        type: String,
        default: "",
    }
},
  {
    timestamps: true
  }
);

resultSchema.pre("validate", function (next) {
    if(this.marks > this.totalMarks) {
        this.invalidate("marks", "Marks is not exceed total marks");
    }
    next();
});

module.exports = mongoose.model("Result", resultSchema);