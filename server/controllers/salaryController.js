const Salary = require("../models/Salary");
const User = require("../models/User");

const createSalary = async (req, res) => {
    try {

        const { teacher, month, salaryAmount } = req.body;

        if(!teacher || !month || salaryAmount === undefined 
            || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) 

            || !Number.isFinite(salaryAmount)

            || salaryAmount <= 0) {
            
           return res.status(400).json({
            success: false,
            message: "valid teacher, month, salary amount are required"
           });

        }

        const teacherInfo = await User.findById(teacher);

        if(!teacherInfo || teacherInfo.role !== "teacher") {
            return res.status(404).json({
                success: false,
                message: "teacher not found"
            });
        }

        const existingSalary = await Salary.findOne({
            teacher,
            month,
        });

        if(existingSalary) {
            return res.status(409).json({
                success: false,
                message: "salary record already exists for this teacher and month"

            });
        }

        const salary = await Salary.create({
            teacher,
            month,
            salaryAmount,
            paidAmount: 0,
            dueAmount: salaryAmount,
            status: "Due",
        });

        return res.status(201).json({
            success: true,
            message: "salary created successfully",
            data: salary,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "salary create to failed",
            error: error.message,
        });
    }
}


const getAllSalaries = async (req, res) => {
    try {
        
        const salaries = await Salary.find().populate("teacher", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "salary record retrieve successfully",
            data: {
                salaries,
                count: salaries.length,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to salary retrieve",
            error: error.message,
        });
    }
}



module.exports = {
    createSalary,
    getAllSalaries,
}