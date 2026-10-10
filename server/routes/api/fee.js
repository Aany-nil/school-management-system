const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { createFee, getAllfees, getStudentFee } = require("../../controllers/feeController");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createFee);
router.get("/all", protect, requireRole("admin"),  getAllfees);
router.get("/student-fees", protect, requireRole("student"), getStudentFee);


module.exports = router;