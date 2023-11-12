const express = require("express");
const router = express.Router();

const {
    appointmentBookAppointmentPostController,
    appointmentGetAvailableTimesPostController,
    appointmentGetUnavailableDaysPostController
} = require("../controllers/appointment");

router.post("/", appointmentGetUnavailableDaysPostController);
router.post("/times", appointmentGetAvailableTimesPostController);
router.post("/book", appointmentBookAppointmentPostController);
module.exports = router;