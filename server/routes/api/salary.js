const express = require("express");
const { createSalary, getAllSalaries, updateSalaryPayment, getTeacherSalary, getSalaryPayslip, deleteSalary } = require("../../controllers/salaryController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router = express.Router();


router.post("/create", protect, requireRole("admin"), createSalary);
router.get("/allsalaries", protect, requireRole("admin"), getAllSalaries);
router.patch("/payment/:id", protect, requireRole("admin"), updateSalaryPayment);
router.get("/teacher-salary", protect, requireRole("teacher"), getTeacherSalary);
router.get("/payslip/:id", protect, requireRole("admin", "teacher"), getSalaryPayslip);
router.delete("/delete/:id", protect, requireRole("admin"), deleteSalary);


module.exports = router;