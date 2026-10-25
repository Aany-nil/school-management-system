const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { createNotice } = require("../../controllers/noticeController");
const router = express.Router();


router.post("/create", protect, requireRole("admin"), createNotice);



module.exports = router;