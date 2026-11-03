
const express = require("express");
const router = express.Router();

const { getSettings, updateSettings, updateAdminProfile, updateAdminPassword,} = require("../../controllers/settingController");

const { protect, requireRole } = require("../../middlewares/authMiddleware");


router.get("/setting", protect, requireRole("admin"), getSettings);

router.put("/update-setting", protect, requireRole("admin"), updateSettings);

router.put("/profile", protect, requireRole("admin"), updateAdminProfile);

router.put("/password", protect, requireRole("admin"), updateAdminPassword);



module.exports = router;
