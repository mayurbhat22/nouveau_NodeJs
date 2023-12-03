const express = require("express");
const router = express.Router();

const {
  loginPostController,
  loginDuoAuthStatusPostController,
  loginDuoAuthPostController,
  loginGoogleAuth,
} = require("../controllers/login");

router.post("/", loginPostController);
router.post("/auth", loginDuoAuthPostController);
router.post("/auth/status", loginDuoAuthStatusPostController);
router.post("/googleauth", loginGoogleAuth);

module.exports = router;
