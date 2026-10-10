const mongoose = require("mongoose");


const salarySchema = new mongoose.Schema({

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },

    month: {
        type: String,
        required: true
    },

    salaryAmount: {
        type: Number,
        required:true,
        min: 0
    },

    paidAmount: {
        type: Number,
        default: 0,
        min: 0

    },

    dueAmount: {
        type: Number,
        default: 0,
        min: 0
    },

    paymentDate: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: ["Paid", "Partial", "Due"],
        default: "Due"
    }
}, 
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Salary", salarySchema);