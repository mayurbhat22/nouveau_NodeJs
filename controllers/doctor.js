//const patientdb = require("../services/patient");
const appointmentdb = require("../services/appointment");

const userdb = require("../services/user");

const patientDb = require("../services/patient");
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

const appointmentDetailsPostController = async (req, res) => {
  const body = req.body;

  const appointmentsData = await patientDb.getAppointmentDetailsofPatients();

  const filteredAppointments = appointmentsData.filter(
    (appointment) => appointment.doctorid === body.doctorID
  );

  const groupedAppointments = filteredAppointments.reduce(
    (result, appointment) => {
      const patientId = appointment.patientid;

      if (!result[patientId]) {
        result[patientId] = [];
      }

      result[patientId].push(appointment);

      return result;
    },
    {}
  );
  const patientDetails = [];
  for (const patientId in groupedAppointments) {
    if (Object.hasOwnProperty.call(groupedAppointments, patientId)) {
      const appointmentsForPatient = groupedAppointments[patientId];
      const patientName = appointmentsForPatient[0]?.name;

      patientDetails.push({ ID: patientId, patientName: patientName });
    }
  }
  res.json(patientDetails);
  res.send();
};

const appointmentDetailsInfoPostController = async (req, res) => {
  const appointmentsData = await patientDb.getAppointmentDetailsofPatients();

  const filteredAppointments = appointmentsData.filter(
    (appointment) => appointment.doctorid == req.params.doctorID
  );

  const groupedAppointments = filteredAppointments.reduce(
    (result, appointment) => {
      const patientId = appointment.patientid;

      if (!result[patientId]) {
        result[patientId] = [];
      }

      result[patientId].push(appointment);

      return result;
    },
    {}
  );

  const patientDetailsInfo = [];
  for (const patientId in groupedAppointments) {
    if (patientId == req.params.patientID) {
      patientDetailsInfo.push(groupedAppointments[patientId]);
    }
  }

  res.json(patientDetailsInfo);
  res.send();
};

module.exports = {
  //doctorPatientsPostController,
  doctorUpcomingApptsPostController,
  appointmentDetailsPostController,
  appointmentDetailsInfoPostController,
};
