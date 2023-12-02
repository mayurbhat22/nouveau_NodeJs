const patientDb = require("../services/patient");

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

module.exports = {
  appointmentDetailsPostController,
};
