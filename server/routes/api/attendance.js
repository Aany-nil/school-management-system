const express = require("express");
const { createAttendance } = require("../../controllers/attendanceController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router  = express.Router();

router.post("/create", protect, requireRole("admin", "teacher"), createAttendance);

module.exports = router;