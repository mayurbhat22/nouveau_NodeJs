const express = require("express");
const router = express.Router();

const {
    loginPostController,
    loginDuoAuthStatusPostController,
    loginDuoAuthPostController
} = require("../controllers/login");

router.post("/", loginPostController);
router.post("/auth", loginDuoAuthPostController);
router.post("/auth/status", loginDuoAuthStatusPostController);
module.exports = router;
