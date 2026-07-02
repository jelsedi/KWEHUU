const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const { requireAuth } = require("../middleware/auth");

// Public

router.post("/register", authController.register);

router.post("/login", authController.login);

// Private

router.get("/profile",

    requireAuth,

    authController.profile

);

router.patch("/profile",

    requireAuth,

    authController.updateProfile

);

router.post("/logout",

    requireAuth,

    authController.logout

);

module.exports = router;