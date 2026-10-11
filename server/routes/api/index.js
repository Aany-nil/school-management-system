const express = require("express");
const router = express.Router();
const auth = require("./auth");
const admin = require("./admin");
const fee = require("./fee");
const salary = require("./salary");
const classRoutes = require("./class");



router.use("/auth", auth);
router.use("/admin", admin);
router.use("/fee", fee);
router.use("/salary", salary);
router.use("/class", classRoutes);


module.exports = router;