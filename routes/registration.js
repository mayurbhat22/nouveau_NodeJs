const express = require("express");
const router = express.Router();

const {
  registrationGetContoller,
  registrationPostContoller,
} = require("../controllers/registration");

router.get("/:email", registrationGetContoller);
router.post("/", registrationPostContoller);
module.exports = router;
