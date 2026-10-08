const express = require("express");
const router = express.Router();
const auth = require("./auth");
const admin = require("./admin");
const fee = require("./fee")

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/fee", fee);


module.exports = router;