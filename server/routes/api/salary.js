const express = require("express");
const { createSalary, getAllSalaries, updateSalaryPayment } = require("../../controllers/salaryController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router = express.Router();


router.post("/create", protect, requireRole("admin"), createSalary);
router.get("/allsalaries", protect, requireRole("admin"), getAllSalaries);
router.patch("/payment/:id", protect, requireRole("admin"), updateSalaryPayment);


module.exports = router;