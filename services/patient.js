const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllPatients() {
  const allPatientIds = await prisma.user.findMany({
    where: {
      role: "Patient",
    },
    select: {
      userid: true,
    },
  });

  return allPatientIds.map((patient) => patient.userid);
}

async function getAppointmentDetailsofPatients() {
  //   const patientAppointments = await prisma.user.findMany({
  //     where: {
  //       role: "Patient",
  //     },
  //     select: {
  //       userid: true,
  //       appointments_appointments_patientidTouser: {
  //         select: {
  //           apptid: true,
  //           doctorid: true,
  //           date: true,
  //           symptoms: true,
  //           covidtest: true,
  //         },
  //       },
  //     },
  //   });
  const appointmentsWithPatients = await prisma.$queryRaw`
  SELECT *
  FROM Nouveau.appointments a
  JOIN Nouveau.user u ON a.patientid = u.userid
  WHERE u.role = 'patient';
`;
  return appointmentsWithPatients;
}

module.exports = {
  getAppointmentDetailsofPatients,
};
