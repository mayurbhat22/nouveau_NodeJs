const { now } = require("moment");
const appointmentdb = require("../services/appointment");

// Return all days after a given date for which the given doctor is fully booked
// body - json with fields:
//      doctorid - the id of the doctor to be checked
//      date - the date (as a Date Object) of the day to check after (typically today's date)
// return - if unsuccessful, appropriate error message, otherwise dates of all days that are unavailable
const appointmentGetUnavailableDaysPostController = async (req, res) => {
    const body = req.body;

    //let today = new Date;
    let day = new Date(body.date);
    //let day = body.date;
    const dates = await appointmentdb.getUnavailableDaysAfter(body.doctorid, day);

    res.json(dates);
    res.send();
};


// Return all times on a given date where a given doctor is available (does not have appointments at those times)
// body - json with fields:
//      doctorid - the id of the doctor to be checked
//      date - the date (as a Date Object) of the day to check for availability
// return - if unsuccessful, appropriate error message, otherwise date objects (using arbitrary date) containing the times the doctor is free
const appointmentGetAvailableTimesPostController = async (req, res) => {
    const body = req.body;

    //let today = new Date;
    let day = new Date(body.date);
    //let day = body.date;
    const dates = await appointmentdb.getAvailableTimesOnByDoctor(body.doctorid, day);

    res.json(dates);
    res.send();
}


// Book appointment with given information and create a covid form associated with the new appointment
// body - json with fields:
//      appointment - all information relating to appointment {
//          date - date and time of appointment,
//          covidtest - boolean value of whether or not they want a covid test taken,
//          symptoms - string containing all of the patient's symptoms,
//          doctorid - id of the doctor they are booking an appointment with,
//          patientid - id of the patient booking the appointment,
//      },
//      covidform - all information relating to covid form {
//          temp - boolean for whether or not they have fever temperature,
//          cough - boolean for whether or not they have a cough,
//          breathing - boolean for whether or not they have trouble breathing,
//          contact - boolean for whether or not they have been in contacted with someone who has covid,
//          travel - boolean for whether or not they have traveled recently
//      }
// return - if unsuccessful, appropriate error message, otherwise apptid of newly created appointment
const appointmentBookAppointmentPostController = async (req, res) => {
    let apptinfo = req.body.appointment;

    const apptid = await appointmentdb.createAppointmentOn(apptinfo);

    if(typeof apptid === "string") {
        res.status(400);
        res.send("Error saving appointment: " + apptid);
        return;
    }

    let covidform = req.body.covidform;

    const formid = await appointmentdb.createCovidForm(apptid, covidform);
    if(typeof formid === "string") {
        res.status(400);
        res.send("Appointment created successfully but error saving covid symptom survey: " + formid);
        return;
    }

    res.json({apptid: apptid})
    res.send();
}







/*
    The commented out methods below can be copied and pasted into dashboard controllers to get upcoming appointments for doctors and patients as well as all of a patient's doctors


// Return all upcoming and previous appointments of a doctor separated by those two categories
// body - json with fields:
//      doctorid - the id of the doctor to be checked
//      date - the date and time (as a Date Object) to split by (typically the current date and time)
// return - if unsuccessful, appropriate error message, otherwise two lists: previous and upcoming containing the respective appointments
const appointmentGetPreviousAndUpcomingAppointmentsByDoctor = async (req, res) => {
    const body = req.body;
    let day = new Date(body.date);

    const previous = await appointmentdb.getAllAppointmentsBeforeByDoctor(body.doctorid, day);
    const upcoming = await appointmentdb.getAllAppointmentsAfterByDoctor(body.doctorid, day);

    res.json({
        previous: previous,
        upcoming: upcoming
    })
}



// Return all upcoming and previous appointments of a patient separated by those two categories
// body - json with fields:
//      patientid - the id of the patient to be checked
//      date - the date and time (as a Date Object) to split by (typically the current date and time)
// return - if unsuccessful, appropriate error message, otherwise two lists: previous and upcoming containing the respective appointments
const appointmentGetPreviousAndUpcomingAppointmentsByPatient = async (req, res) => {
    const body = req.body;
    let day = new Date(body.date);

    const previous = await appointmentdb.getAllAppointmentsBeforeByPatient(body.patientid, day);
    const upcoming = await appointmentdb.getAllAppointmentsAfterByPatient(body.patientid, day);

    res.json({
        previous: previous,
        upcoming: upcoming
    })
}



// Return doctors that a patient has had - both in the past and all time
// body - json with fields:
//      patientid - the id of the patient whose doctors we are getting
//      date - the date and time (as a Date Object) to split by (typically the current date and time)
// return - if unsuccessful, appropriate error message, otherwise two lists: past and all containing the respective doctor profiles
const appointmentGetDoctors = async (req, res) => {
    const body = req.body;
    let day = new Date(body.date);

    const past = await appointmentdb.getAllDoctorsUpToPresent(body.patientid, day);
    const all = await appointmentdb.getAllDoctorsAllTime(body.patientid);

    res.json({
        past: past,
        all: all
    })
}


*/



module.exports = {
    appointmentBookAppointmentPostController,
    appointmentGetAvailableTimesPostController,
    appointmentGetUnavailableDaysPostController,
};