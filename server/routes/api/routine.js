const express = require("express");
const { requireRole, protect } = require("../../middlewares/authMiddleware");
const { createRoutine, getAllRoutine, getSingleRoutine, updateRoutine, deleteRoutine } = require("../../controllers/routineController");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createRoutine);
router.get("/all", protect, requireRole("admin", "teacher", "student"), getAllRoutine);
router.get("/single-routine/:id", protect, requireRole("admin", "teacher"), getSingleRoutine);
router.patch("/routine-update/:id", protect, requireRole("admin"), updateRoutine);
router.delete("/routine-delete/:id", protect, requireRole("admin"), deleteRoutine);



module.exports = router;