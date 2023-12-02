const insurancedb = require("../services/insuranceplans");

// Return all patients who have the given provider
// body - json with providerid
// return - if unsuccessful, appropriate error message, otherwise name and id for each patient and their plan
const insurancePatientsPostController = async (req, res) => {
    const body = req.body;

    const results = await insurancedb.getAllPatientsAndPlansBasicByProvider(body.providerid);

    res.json(results);
    res.send();
};


// Return all of a given providers plans
// body - json with providerid
// return - if unsuccessful, appropriate error message, otherwise all plans of the provider
const insurancePlansPostController = async (req, res) => {
    const results = await insurancedb.getAllPlansByProvider(req.body.providerid);

    res.json(results);
    res.send();
}



const insuranceProviderNewPlanPostController = async (req, res) => {
    const newPlan = await insurancedb.newInsuranceplan(req.body);

    res.json(newPlan);
    res.send();
}

const insuranceProviderUpdatePlanPostController = async (req, res) => {
    const updatedPlan = await insurancedb.updateInsuranceplan(req.body);

    if(typeof updatedPlan === "string") {
        res.status(400);
        res.send("Error updating plan: " + updatedPlan);
        return;
    }

    res.json(updatedPlan);
    res.send();
}


const insuranceProviderDeletePlanPostController = async (req, res) => {
    const deletedPlan = await insurancedb.deleteInsuranceplan(req.body.planid, req.body.providerid);

    if(typeof deletedPlan === "string") {
        res.status(400);
        res.send("Error deleting plan: " + deletedPlan);
        return;
    }

    res.json(deletedPlan);
    res.send();
}






const insurancePatientGetAllPlansGroupedPostController = async (req, res) => {
    const results = await insurancedb.getAllPlansGroupedByProvider();

    res.json(results);
    res.send();
}


const insurancePatientGetPlanPostController = async (req, res) => {
    const results = await insurancedb.getPlanByPatientIdWithProviderInfo(req.body.patientid);
    
    res.json(results);
    res.send();
}


const insurancePatientSubscribeToPlanPostController = async (req, res) => {
    const subscribe = await insurancedb.patientSubscribeToPlan(req.body.patientid, req.body.planid)

    res.json(subscribe);
    res.send();
}


const insurancePatientUnsubscribefromPlanPostController = async (req, res) => {
    const unsubscribe = await insurancedb.patientUnsubscribeFromPlan(req.body.patientid)

    if(typeof unsubscribe === "string") {
        res.status(400);
        res.send("Error unsubscribing from plan: " + unsubscribe);
        return;
    }

    res.json(unsubscribe);
    res.send();
}



module.exports = {
    insurancePatientsPostController,
    insurancePlansPostController,
    insurancePatientGetAllPlansGroupedPostController,
    insurancePatientGetPlanPostController,
    insurancePatientSubscribeToPlanPostController,
    insurancePatientUnsubscribefromPlanPostController,
    insuranceProviderDeletePlanPostController,
    insuranceProviderNewPlanPostController,
    insuranceProviderUpdatePlanPostController
};