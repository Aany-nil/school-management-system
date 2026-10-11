const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { createClass, getAllClasses, getSingleClass } = require("../../controllers/classController");
const router = express.Router();


router.post("/create", protect, requireRole("admin"), createClass);
router.get("/allclasses", protect, getAllClasses);
router.get("/singleclass/:id", protect, getSingleClass);

module.exports = router;

