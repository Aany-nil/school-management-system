const express = require("express");
const router = express.Router();

const { getMyProfile, updateMyProfile, uploadProfilePicture } = require("../../controllers/profileController");

const { protect } = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/uploadMiddleware");




router.get("/", protect, getMyProfile);
router.put("/", protect, updateMyProfile);
router.post("/upload-picture", protect, upload.single("profilePicture"), uploadProfilePicture);



module.exports = router;