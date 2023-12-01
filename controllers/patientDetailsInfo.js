const patientDb = require("../services/patient");

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
  appointmentDetailsInfoPostController,
};
