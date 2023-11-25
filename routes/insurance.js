const express = require("express");
const router = express.Router();

const {
    insurancePatientsPostController,
    insurancePlansPostController
} = require("../controllers/insurance");

router.post("/patients", insurancePatientsPostController);
router.post("/plans", insurancePlansPostController);
module.exports = router;