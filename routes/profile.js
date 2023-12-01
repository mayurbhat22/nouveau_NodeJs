const express = require("express");
const router = express.Router();

const {
    profileGetDoctorPostController,
    profileUpdateDoctorPostController,
    profileGetPatientPostController,
    profileUpdatePatientPostController,
    profileGetInsurancePostController,
    profileUpdateInsurancePostController
} = require("../controllers/profile");

router.post("/doctor", profileGetDoctorPostController);
router.post("/doctor/update", profileUpdateDoctorPostController);
router.post("/patient", profileGetPatientPostController);
router.post("/patient/update", profileUpdatePatientPostController);
router.post("/insurance", profileGetInsurancePostController);
router.post("/insurance/update", profileUpdateInsurancePostController);
module.exports = router;