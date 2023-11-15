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



module.exports = {
    insurancePatientsPostController,
    insurancePlansPostController
};