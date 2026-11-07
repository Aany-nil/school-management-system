
const express = require("express");
const router = express.Router();

const {
  protect,
  requireSuperAdmin,
} = require("../../middlewares/authMiddleware");

const {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  updateSchoolStatus,
  updateSchoolModules,
} = require("../../controllers/superAdminController");

router.use(protect, requireSuperAdmin);



router.post("/schools", createSchool);
router.get("/schools", getAllSchools);
router.get("/schools/:id", getSchoolById);
router.put("/schools/:id", updateSchool);

router.patch("/schools/:id/status", updateSchoolStatus);

router.patch("/schools/:id/modules", updateSchoolModules);

module.exports = router;
