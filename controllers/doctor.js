//const patientdb = require("../services/patient");
const appointmentdb = require("../services/appointment");
const userdb = require("../services/user")
const feedbackdb = require("../services/feedback")
const doctordb = require("../services/doctor")

/*
// Return all of the given doctor's patients
// body - json with doctorid
// return - if unsuccessful, appropriate error message, otherwise basic profile info for each patient
const doctorPatientsPostController = async (req, res) => {
    const body = req.body;

    const results = await insurancedb.getAllPatientsAndPlansBasicByProvider(body.providerid);

    res.json(results);
    res.send();
};
*/

// Return all of the given doctor's upcoming appointments
// body - json with fields:
//      doctorid - the id of the doctor whose information we are getting
// return - if unsuccessful, appropriate error message, otherwise all upcoming appointments for doctor and brief information about each
const doctorUpcomingApptsPostController = async (req, res) => {
  let today = new Date();
  const results = await appointmentdb.getAllAppointmentsAfterByDoctor(
    req.body.doctorid,
    today
  );

  for (let i = 0; i < results.length; i++) {
    const user = await userdb.getUserById(results[i].patientid);
    results[i]["patientname"] = user.name;
  }

    res.json(results);
    res.send();
}


// Return detailed information about doctor for their page including their profile, their reviews, and whether or not the current patient has had them (if applicable)
// body - json with fields:
//      doctorid - the id of the doctor whose information we are getting
//      patientid(optional) - the id of the patient who is viewing the page
// return - if unsuccessful, appropriate error message, otherwise profile, feedback and whether or not patient has had this doctor
const doctorGetDetailsController = async (req, res) => {
    let today = new Date();
    body = req.body
    const feedback = await feedbackdb.getFeedbackByDoctorId(body.doctorid)

    const doctorProfile = await doctordb.getDoctorProfileById(body.doctorid);

    const results = {
        feedback: feedback,
        doctor: doctorProfile,
    }

    if (body.patientid !== undefined) {
        const patientDoctors = await appointmentdb.getAllDoctorsUpToPresent(body.patientid, today)
        results.isPatient = false;
        for (let i=0; i<patientDoctors.length; i++) {
            if(body.doctorid === patientDoctors[i].id) {
                results.isPatient = true;
            }
        }

        const givenFeedback = await feedbackdb.getFeedbackByDoctorIdAndPatientId(body.doctorid, body.patientid);
        results.hasGivenFeedback = givenFeedback !== null
    }

    res.json(results);
    res.send();
}


// Leave feedback for a given doctor by a given patient
// body - json with fields:
//      doctorid - the id of the doctor being reviewed
//      patientid - the id of the patient leaving the feedback
//      rating - integer rating of doctor from 1-5
//      written (optional) - written review for doctor
// return - if unsuccessful, appropriate error message, otherwise feedback object created
const doctorLeaveFeedbackPostController = async (req, res) => {
    body = req.body
    let today = new Date();

    const patientDoctors = await appointmentdb.getAllDoctorsUpToPresent(body.patientid, today)
    let isPatient = false;
    for (let i=0; i<patientDoctors.length; i++) {
        if(body.doctorid === patientDoctors[i].id) {
            isPatient = true;
        }
    }

    if (!isPatient) {
        res.status(400);
        res.send("Error sending feedback: You have not had an appointment with this doctor");
        return;
    }
    
    
    const results = await feedbackdb.postFeedback(body)

    res.json(results);
    res.send();
}



module.exports = {
    //doctorPatientsPostController,
    doctorUpcomingApptsPostController,
    doctorGetDetailsController,
    doctorLeaveFeedbackPostController
};
