const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { createNotice, getAllNotice, getNoticeById } = require("../../controllers/noticeController");
const router = express.Router();


router.post("/create", protect, requireRole("admin"), createNotice);
router.get("/all-notice", protect, requireRole("admin", "teacher", "student"), getAllNotice);
router.get("/single-notice/:id", protect, requireRole("admin", "teacher", "student"), getNoticeById);



module.exports = router;