const express = require("express");
const { createResult } = require("../../controllers/resultController");
const { requireRole, protect } = require("../../middlewares/authMiddleware");
const router = express.Router();



router.post("/create", protect, requireRole("admin", "teacher"),  createResult);


module.exports = router;