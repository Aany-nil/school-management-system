const express = require("express");
const { requireRole, protect } = require("../../middlewares/authMiddleware");
const { createRoutine, getAllRoutine } = require("../../controllers/routineController");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createRoutine);
router.get("/all", protect, requireRole("admin", "teacher", "student"), getAllRoutine);



module.exports = router;