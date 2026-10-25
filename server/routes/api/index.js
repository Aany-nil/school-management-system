const express = require("express");
const router = express.Router();
const auth = require("./auth");
const admin = require("./admin");
const fee = require("./fee");
const salary = require("./salary");
const classRoutes = require("./class");
const subject = require("./subject");
const attendance = require("./attendance");
const routine = require("./routine");
const result = require("./result");
const student = require("./student");
const teacher = require("./teacher");



router.use("/auth", auth);
router.use("/admin", admin);
router.use("/fee", fee);
router.use("/salary", salary);
router.use("/class", classRoutes);
router.use("/subject", subject);
router.use("/attendance", attendance);
router.use("/routine", routine);
router.use("/result", result);
router.use("/student", student);
router.use("/teacher", teacher);




module.exports = router;