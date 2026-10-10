const express = require("express");
const { createSalary, getAllSalaries } = require("../../controllers/salaryController");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const router = express.Router();


router.post("/create", protect, requireRole("admin"), createSalary);
router.get("/allsalaries", protect, requireRole("admin"), getAllSalaries);


module.exports = router;