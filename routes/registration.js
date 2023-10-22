const express = require("express");
const router = express.Router();

const {
  registrationGetContoller,
  registrationPostContoller,
  registrationDuoEnrollStatusPostController,
  registrationDuoEnrollPostController,
  registrationResetMFAController
} = require("../controllers/registration");

router.get("/:email", registrationGetContoller);
router.post("/", registrationPostContoller);
router.post("/mfa", registrationResetMFAController);
router.post("/enroll", registrationDuoEnrollPostController);
router.post("/enroll/status", registrationDuoEnrollStatusPostController);
module.exports = router;
