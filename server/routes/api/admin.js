const express = require("express");
const { getTeachers, getStudents, getAllUsers, getStudentById, getTeacherById } = require("../../controllers/adminController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router = express.Router();



router.get("/teachers", protect, requireRole("admin"),  getTeachers);
router.get("/students", protect, requireRole("admin", "teacher"), getStudents);
router.get("/allusers", protect, requireRole("admin"),  getAllUsers);
router.get("/getstudent/:id", protect, requireRole("admin", "teacher"), getStudentById);
router.get("/singleteacher/:id", protect, requireRole("admin"), getTeacherById );



module.exports = router;