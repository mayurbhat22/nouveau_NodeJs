const doctordb = require("../services/doctor");
const userdb = require("../services/user")

// Return current profile information for given doctor
// body - json with doctorid
// return - if unsuccessful, appropriate error message, otherwise profile info for the doctor
const profileGetDoctorPostController = async (req, res) => {
    const body = req.body;

    const result = await doctordb.getDoctorProfileById(body.doctorid)

    if(typeof result === "string") {
        res.status(400);
        res.send("Error updating doctor: " + result);
        return;
    }

    res.json(result);
    res.send();
};


// Update profile information for given doctor
// body - json with fields:
//      doctorid - the id of the doctor whose information we are updating
//      email - the doctor's new email, -- must check that this doesn't exist in user for another user
//      phone - the doctor's new phone number,
//      specialty - the doctor's new(?) specialty,
//      covid: whether or not the doctor supports covid care,
// return - if unsuccessful, appropriate error message, otherwise profile info for the doctor
const profileUpdateDoctorPostController = async (req, res) => {
    const body = req.body;

    const result = await doctordb.upsertDoctorProfile(body)

    if(typeof result === "string") {
        res.status(400);
        res.send("Error updating profile: " + result);
        return;
    }

    res.json(result);
    res.send();
};


// Return current profile information for given patient
// body - json with patientid
// return - if unsuccessful, appropriate error message, otherwise profile info for the patient
const profileGetPatientPostController = async (req, res) => {
    const body = req.body;

    const results = await userdb.getUserById(body.patientid)

    res.json(results);
    res.send();
};


// Update profile information for given patient
// body - json with fields:
//      patientid - the id of the patient whose information we are updating
//      email - the patient's new email, -- must check that this doesn't exist in user for another user
//      phone - the doctor's new phone number,
// return - if unsuccessful, appropriate error message, otherwise profile info for the doctor
const profileUpdatePatientPostController = async (req, res) => {
    const body = req.body;

    const results = await userdb.updateUser(body)

    if(typeof results === "string") {
        res.status(400);
        res.send("Error updating profile: " + results);
        return;
    }

    res.json(results);
    res.send();
};


// Return current profile information for given insurance provider
// body - json with providerid
// return - if unsuccessful, appropriate error message, otherwise profile info for the patient
const profileGetInsurancePostController = async (req, res) => {
    const body = req.body;

    const results = await userdb.getUserById(body.providerid)

    res.json(results);
    res.send();
};


// Update profile information for given provider
// body - json with fields:
//      patientid - the id of the patient whose information we are updating
//      email - the patient's new email, -- must check that this doesn't exist in user for another user
//      name - the doctor's new phone number,
// return - if unsuccessful, appropriate error message, otherwise profile info for the doctor
const profileUpdateInsurancePostController = async (req, res) => {
    const body = req.body;

    const results = await userdb.updateUser(body)

    if(typeof results === "string") {
        res.status(400);
        res.send("Error updating profile: " + results);
        return;
    }

    res.json(results);
    res.send();
};


module.exports = {
    profileGetDoctorPostController,
    profileGetPatientPostController,
    profileUpdateDoctorPostController,
    profileUpdatePatientPostController,
    profileGetInsurancePostController,
    profileUpdateInsurancePostController
};