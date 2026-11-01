const express = require("express");
const { createSubject, getAllSubject, getSingleSubject, updateSubject, deleteSubject, getMySubjects } = require("../../controllers/subjectController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createSubject);
router.get("/allsubject", protect, getAllSubject);
router.get("/singlesubject/:id", protect, getSingleSubject);
router.patch("/update/:id", protect, requireRole("admin"), updateSubject);
router.delete("/delete/:id", protect, requireRole("admin"), deleteSubject);
router.get("/my-subjects", protect, requireRole("teacher"), getMySubjects);


module.exports = router;