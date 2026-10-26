const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { getAdminDashboard, getTeacherDashboard, getStudentDashboard } = require("../../controllers/dashboardController");
const router = express.Router();


router.get("/admin", protect, requireRole("admin"), getAdminDashboard);
router.get("/teacher", protect, requireRole("teacher"), getTeacherDashboard);
router.get("/student", protect, requireRole("student"), getStudentDashboard);



module.exports = router;