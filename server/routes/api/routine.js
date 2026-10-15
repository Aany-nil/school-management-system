const express = require("express");
const { requireRole, protect } = require("../../middlewares/authMiddleware");
const { createRoutine } = require("../../controllers/routineController");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createRoutine);



module.exports = router;