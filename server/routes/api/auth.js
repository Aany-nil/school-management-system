const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const { requireRole, protect } = require("../../middlewares/authMiddleware");


router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.patch("/admin-set-password", protect, requireRole("admin"), authController.adminSetPassword);

module.exports = router;

