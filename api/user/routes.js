"use strict";

const router = require("express").Router();
const { UserController } = require("@api/controller");
const Auth = require("@middleware/authorization");

router.post("/login", UserController.login);
router.get("/profile", Auth.isAuthenticated(), UserController.profile);
router.post(
    "/upload/profile",
    Auth.isAuthenticated(),
    UserController.uploadProfilePhoto
);
router.get(
    "/validate/login",
    Auth.isAuthenticated(),
    UserController.validateLogin
);
router.get("/logout", Auth.isAuthenticated(), UserController.logout);
router.put(
    "/profile/:id",
    Auth.isAuthenticated(),
    UserController.updateProfile
);
router.delete("/profile", Auth.isAuthenticated(), UserController.removeProfile);

router.post("/sendOtp", UserController.sendOtp);
router.post("/verifyOtp", UserController.verifyOtp);
router.post("/sendEmailOtp", UserController.sendEmailOtp);
router.post("/verifyEmailOtp", UserController.verifyEmailOtp);

router.post("/register", UserController.register);

router.get("/checkToken", Auth.isAuthenticated(), UserController.checkToken);

module.exports = router;
