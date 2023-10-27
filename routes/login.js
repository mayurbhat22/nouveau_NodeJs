const express = require("express");
const router = express.Router();

const {
  loginPostController,
  loginDuoAuthStatusPostController,
  loginDuoAuthPostController,
  loginGoogleAuth,
  logoutGoogleAuth,
} = require("../controllers/login");

router.post("/", loginPostController);
router.post("/auth", loginDuoAuthPostController);
router.post("/auth/status", loginDuoAuthStatusPostController);

//Routes for Google Auth
router.post("/googleauth", loginGoogleAuth);
router.post("/logout", logoutGoogleAuth);

module.exports = router;
