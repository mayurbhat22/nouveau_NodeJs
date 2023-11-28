const express = require("express");
const router = express.Router();

const {
    //doctorPatientsPostController,
    doctorUpcomingApptsPostController
} = require("../controllers/doctor");

//router.post("/patients", doctorPatientsPostController);
router.post("/upcoming", doctorUpcomingApptsPostController);
module.exports = router;