const express = require("express");
const router = express.Router();

const {
  //doctorPatientsPostController,
  doctorUpcomingApptsPostController,
  appointmentDetailsPostController,
  appointmentDetailsInfoPostController,
  //doctorPatientsPostController,
  doctorUpcomingApptsPostController,
  doctorGetDetailsController,
  doctorLeaveFeedbackPostController,
} = require("../controllers/doctor");

//router.post("/patients", doctorPatientsPostController);
router.post("/upcoming", doctorUpcomingApptsPostController);
router.post("/patientdetails", appointmentDetailsPostController);
router.post(
  "/patientdetails/patientdetailsInfo/:patientID/:doctorID",
  appointmentDetailsInfoPostController
);
router.post("/details", doctorGetDetailsController);
router.post("/feedback", doctorLeaveFeedbackPostController);

module.exports = router;
