const express = require("express");
const router = express.Router();

const {
  appointmentDetailsPostController,
} = require("../controllers/patientDetails");

const {
  appointmentDetailsInfoPostController,
} = require("../controllers/patientDetailsInfo");

router.post("/patientdetails", appointmentDetailsPostController);
router.post(
  "/patientdetails/patientdetailsInfo/:patientID/:doctorID",
  appointmentDetailsInfoPostController
);
module.exports = router;
