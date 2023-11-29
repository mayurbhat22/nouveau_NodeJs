const express = require("express");
const router = express.Router();

const {
  appointmentDetailsPostController,
} = require("../controllers/patientDetails");

router.post("/patientdetails", appointmentDetailsPostController);
module.exports = router;
