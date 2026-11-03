
const express = require("express");
const {
    requireRole,
    protect
} = require("../../middlewares/authMiddleware");

const {
    createRoutine,
    getAllRoutine,
    getSingleRoutine,
    updateRoutine,
    deleteRoutine,
    getMyRoutine
} = require("../../controllers/routineController");

const router = express.Router();

// Admin
router.post("/create", protect, requireRole("admin"), createRoutine);
router.patch("/routine-update/:id", protect, requireRole("admin"), updateRoutine);
router.delete("/routine-delete/:id", protect, requireRole("admin"), deleteRoutine);

// Admin, Teacher and Student
// Controller automatically filters data according to role
router.get(
    "/all",
    protect,
    requireRole("admin", "teacher", "student"),
    getAllRoutine
);

// Admin and Teacher
router.get(
    "/single-routine/:id",
    protect,
    requireRole("admin", "teacher"),
    getSingleRoutine
);

// Teacher
router.get(
    "/my-routine",
    protect,
    requireRole("teacher"),
    getMyRoutine
);

module.exports = router;
