const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { getAdminDashboard } = require("../../controllers/dashboardController");
const router = express.Router();


router.get("/admin", protect, requireRole("admin"), getAdminDashboard);



module.exports = router;