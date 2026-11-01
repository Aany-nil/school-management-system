
const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");

const {
    getAllTeachers,
    getTeacherById,
    updateTeacherSalary,
} = require("../../controllers/teacherController");
const { getMyStudents } = require("../../controllers/studentController");

const router = express.Router();

// Get all teachers
router.get(
    "/all-teachers",
    protect,
    requireRole("admin"),
    getAllTeachers
);

// Get a single teacher
router.get(
    "/single-teacher/:id",
    protect,
    requireRole("admin"),
    getTeacherById
);

// Set or update a teacher's fixed monthly salary
router.patch(
    "/:id/salary",
    protect,
    requireRole("admin"),
    updateTeacherSalary
);

router.get(
  "/my-students",
  protect,
  requireRole("teacher"),
  getMyStudents
);

module.exports = router;
