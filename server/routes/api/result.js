const express = require("express");
const { createResult, getAllResults, getStudentResult, updateResult, deleteResult } = require("../../controllers/resultController");
const { requireRole, protect } = require("../../middlewares/authMiddleware");
const router = express.Router();



router.post("/create", protect, requireRole("admin", "teacher"),  createResult);
router.get("/all-results", protect, requireRole("admin"), getAllResults);
router.get("/student-results/:studentId", protect, requireRole("admin", "teacher", "student"), getStudentResult);
router.patch("/results-update/:id", protect, requireRole("admin"), updateResult);
router.delete("/result-delete/:id", protect, requireRole("admin"), deleteResult);


module.exports = router;