
const express = require("express");
const router = express.Router();

const { getSettings, updateSettings, updateAdminProfile, updateAdminPassword, getSchoolInfo,} = require("../../controllers/settingController");

const { protect, requireRole } = require("../../middlewares/authMiddleware");


router.get("/setting", protect, requireRole("admin"), getSettings);

router.put("/update-setting", protect, requireRole("admin"), updateSettings);

router.put("/profile", protect, requireRole("admin"), updateAdminProfile);

router.put("/password", protect, requireRole("admin"), updateAdminPassword);

router.get("/school-info", protect, requireRole("admin", "teacher", "student"), getSchoolInfo);



module.exports = router;
