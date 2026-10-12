const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { createClass, getAllClasses, getSingleClass, updateClass, deleteClass } = require("../../controllers/classController");
const router = express.Router();


router.post("/create", protect, requireRole("admin"), createClass);
router.get("/allclasses", protect, getAllClasses);
router.get("/singleclass/:id", protect, getSingleClass);
router.patch("/update/:id", protect, requireRole("admin"),  updateClass);
router.delete("/delete/:id", protect, requireRole("admin"), deleteClass);

module.exports = router;

