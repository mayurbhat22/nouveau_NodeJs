const express = require("express");
const router = express.Router();

const {
  patientDoctorsPostController,
  patientUpcomingApptsPostController,
  patientPlanPostController,
} = require("../controllers/patient");

router.post("/doctors", patientDoctorsPostController);
router.post("/plan", patientPlanPostController);
router.post("/upcoming", patientUpcomingApptsPostController);
module.exports = router;
