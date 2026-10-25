const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { getAllStudents } = require("../../controllers/studentController");
const router = express.Router();


router.get("/all-students", protect, requireRole("admin", "teacher"), getAllStudents);


module.exports = router;