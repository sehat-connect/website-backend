"use strict";

const router = require("express").Router();

/**
 * Import All Express Router Here
 */

router.use("/about", require("./about/routes"));
router.use("/career", require("./career/routes"));
router.use("/faq", require("./faq/routes"));
router.use("/file", require("./file/routes"));
router.use("/home", require("./home/routes"));

router.use("/menu", require("./menu/routes"));
router.use("/news", require("./news/routes"));
router.use("/setting", require("./setting/routes"));
router.use("/testimonial", require("./testimonial/routes"));

router.use("/user", require("./user/routes"));

router.use("/page", require("./page/routes"));

router.use("/grp", require("./grp/routes"));
router.use("/community", require("./community/routes"));
router.use("/abha", require("./abha/routes"));
router.use("/contact", require("./contact/routes"));
router.use("/phr", require("./phr/routes"));

module.exports = router;
