
const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");

const {
    getAllTeachers,
    getTeacherById,
    updateTeacherSalary,
    getMyClasses,
} = require("../../controllers/teacherController");
const { getMyStudents } = require("../../controllers/studentController");


const router = express.Router();

router.get( "/all-teachers", protect, requireRole("admin"), getAllTeachers);

router.get("/single-teacher/:id", protect, requireRole("admin"), getTeacherById);

router.patch("/:id/salary", protect, requireRole("admin"), updateTeacherSalary);

router.get("/my-students", protect, requireRole("teacher"), getMyStudents);

router.get("/my-classes", protect, requireRole("teacher"), getMyClasses);

module.exports = router;
