const express = require("express");
const router = express.Router();
const auth = require("./auth");
const admin = require("./admin");
const fee = require("./fee");
const salary = require("./salary");
const classRoutes = require("./class");
const subject = require("./subject");
const attendance = require("./attendance");



router.use("/auth", auth);
router.use("/admin", admin);
router.use("/fee", fee);
router.use("/salary", salary);
router.use("/class", classRoutes);
router.use("/subject", subject);
router.use("/attendance", attendance);



module.exports = router;