const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { getAllStudents, getStudentById } = require("../../controllers/studentController");
const router = express.Router();


router.get("/all-students", protect, requireRole("admin", "teacher"), getAllStudents);
router.get("/single-student/:id", protect, requireRole("admin", "teacher"), getStudentById);


module.exports = router;