const doctordb = require("../services/doctor");
const appointmentdb = require("../services/appointment");
const insurancedb = require("../services/insuranceplans");

// Return all doctors a patient has had
// body - json with patientid
// return - if unsuccessful, appropriate error message, otherwise profile info for each doctor
const patientDoctorsPostController = async (req, res) => {
    const body = req.body;

    const results = await appointmentdb.getAllDoctorsAllTime(body.patientid)

    res.json(results);
    res.send();
};


// Return all of the given patient's upcoming appointments
// body - json with patientid
// return - if unsuccessful, appropriate error message, otherwise all of the patient's upcoming appointments
const patientUpcomingApptsPostController = async (req, res) => {
    let today = new Date();
    const results = await appointmentdb.getAllAppointmentsAfterByPatient(req.body.patientid, today)

    
    for(let i=0; i<results.length; i++) {
        const doctor = await doctordb.getDoctorProfileById(results[i].doctorid);
        results[i]['doctorname'] = doctor.name;
    }

    res.json(results);
    res.send();
}


// Return the given patient's plan if they have one
// body - json with patientid
// return - if unsuccessful, appropriate error message, otherwise the plan of the patient
const patientPlanPostController = async (req, res) => {
    const results = await insurancedb.getPlanByPatientIdWithProviderInfo(req.body.patientid)

    res.json(results);
    res.send();
}



module.exports = {
    patientDoctorsPostController,
    patientUpcomingApptsPostController,
    patientPlanPostController
};