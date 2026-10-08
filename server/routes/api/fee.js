const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { createFee, getAllfees } = require("../../controllers/feeController");
const router = express.Router();

router.post("/create", protect, requireRole("admin"), createFee);
router.get("/all", protect, requireRole("admin"),  getAllfees);


module.exports = router;