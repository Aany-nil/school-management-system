const express = require("express");
const { createSubject, getAllSubject, getSingleSubject, updateSubject, deleteSubject } = require("../../controllers/subjectController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createSubject);
router.get("/allsubject", protect, getAllSubject);
router.get("/singlesubject/:id", protect, getSingleSubject);
router.patch("/update/:id", protect, requireRole("admin"), updateSubject);
router.delete("/delete/:id", protect, requireRole("admin"), deleteSubject);


module.exports = router;