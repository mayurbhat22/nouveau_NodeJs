const express = require("express");
const router = express.Router();

const {
    insurancePatientsPostController,
    insurancePlansPostController,
    insurancePatientGetAllPlansGroupedPostController,
    insurancePatientGetPlanPostController,
    insurancePatientSubscribeToPlanPostController,
    insurancePatientUnsubscribefromPlanPostController,
    insuranceProviderDeletePlanPostController,
    insuranceProviderNewPlanPostController,
    insuranceProviderUpdatePlanPostController
} = require("../controllers/insurance");

router.post("/patients", insurancePatientsPostController);
router.post("/plans", insurancePlansPostController);

router.post("/provider/new", insuranceProviderNewPlanPostController);
router.post("/provider/update", insuranceProviderUpdatePlanPostController);
router.post("/provider/delete", insuranceProviderDeletePlanPostController);

router.post("/patient/plan", insurancePatientGetPlanPostController)
router.post("/patient/allPlans", insurancePatientGetAllPlansGroupedPostController)
router.post("/patient/subscribe", insurancePatientSubscribeToPlanPostController)
router.post("/patient/unsubscribe", insurancePatientUnsubscribefromPlanPostController)


module.exports = router;