const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { getAllStudents, getStudentById, assignStudentToClass } = require("../../controllers/studentController");
const router = express.Router();


router.get("/all-students", protect, requireRole("admin", "teacher"), getAllStudents);
router.get("/single-student/:id", protect, requireRole("admin", "teacher"), getStudentById);
router.patch("/assign-class/:id", protect, requireRole("admin"), assignStudentToClass);



module.exports = router;