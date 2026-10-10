const Fee = require("../models/Fee");
const User = require("../models/User");

const createFee = async (req, res) => {
    try {
      const { student, totalFee, paidAmount=0 } = req.body;

      const studentInfo = await User.findById(student);
      
      if(!studentInfo || studentInfo.role !== "student") {
        return res.status(404).json({
            success: false,
            message: "student not found",
        });
      }

      if (totalFee < 0 || paidAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "fee amount cannot be negative",
      });
    }

      if(paidAmount > totalFee) {
        return res.status(400).json({
            success: false,
            message: "paid amount cannot be greater than total fee"
        })
      }

      const dueAmount = totalFee - paidAmount;

      let status = "Due";

      if(paidAmount === totalFee) {
        status = "Paid"
      } else if(paidAmount > 0 ) {
        status = "Partial"
      }

      const fee = await Fee.create({
        student,
        totalFee,
        paidAmount,
        dueAmount,
        status
      });

      return res.status(201).json({
        success: true,
        message: "fee created successfully",
        data: fee,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "failed to create fee",
        error: error.message
      });
    }
}

const getAllfees = async (req, res) => {
    try {
        const fees = await Fee.find()
        .populate("student", "name email role")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "fees record successfully",
            data: {
                fees,
                count: fees.length,
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "fees record retrive failed",
            error: error.message,
        });
        
    }
}

const getStudentFee = async (req, res) => {
  try {

    const studentfees = await Fee.findOne({
        student: req.user._id
    }).populate("student", "name email")

    if(!studentfees) {
      return res.status(404).json({
        success: false,
        message: "student fee record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "student fees retreive successfully",
      data: studentfees,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to retrieve your fees",
      error: error.message
    });
    
  }
}


module.exports = { 
    createFee,
    getAllfees,
    getStudentFee 
}