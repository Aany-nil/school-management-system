const express = require("express");
const { createSubject, getAllSubject, getSingleSubject, updateSubject } = require("../../controllers/subjectController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createSubject);
router.get("/allsubject", protect, getAllSubject);
router.get("/singlesubject/:id", protect, getSingleSubject);
router.patch("/update/:id", protect, requireRole("admin"), updateSubject);


module.exports = router;