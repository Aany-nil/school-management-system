const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { getAllTeachers, getTeacherById } = require("../../controllers/teacherController");
const router = express.Router();


router.get("/all-teachers", protect, requireRole("admin"), getAllTeachers);
router.get("/single-teacher/:id", protect, requireRole("admin"), getTeacherById);


module.exports = router;