//const patientdb = require("../services/patient");
const appointmentdb = require("../services/appointment");

const userdb = require("../services/user");

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
// body - json with doctorid
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
};

module.exports = {
  //doctorPatientsPostController,
  doctorUpcomingApptsPostController,
};
