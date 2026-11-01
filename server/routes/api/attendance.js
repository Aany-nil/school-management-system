const express = require("express");
const { createAttendance, getAllAttendance, updateAttendance, getMyAttendance, deleteAttendance, getClassStudents } = require("../../controllers/attendanceController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router  = express.Router();



router.post("/create", protect, requireRole("admin", "teacher"), createAttendance);
router.get("/all", protect, requireRole("admin", "teacher"),  getAllAttendance);
router.put("/update/:id", protect, requireRole("admin", "teacher"), updateAttendance);
router.get("/my-attendance", protect, requireRole("student"), getMyAttendance);
router.delete("/delete/:id", protect, requireRole("admin"), deleteAttendance);
router.get("/students", protect, requireRole("admin", "teacher"),getClassStudents);


module.exports = router;