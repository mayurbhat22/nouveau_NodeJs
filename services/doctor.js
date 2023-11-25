const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const feedback = require("./feedback");

async function getAllDoctors() {
    const doctors = await prisma.doctor.findMany();
    return doctors;
}


async function getDoctorById(id) {
    const doctor = await prisma.doctor.findFirst({
        where: {doctorid: id},
    });
    return doctor;
}


async function getDoctorsBySpecialty(specialty) {
    const doctors = await prisma.doctor.findMany({
        where: { specialty: specialty},
    });

    return doctors;
}

async function getAllDoctorProfiles() {
    const allIds = await prisma.doctor.findMany({
        select: {
            doctorid: true
        }
    });

    profiles = [];
    for(let i=0; i<allIds.length; i++) {
        const prof = await getDoctorProfileById(allIds[i].doctorid)
        profiles.push(prof);
    }

    return profiles;
}

async function getDoctorProfileById(id) {
    const doctor = await getDoctorById(id);
    const user = await prisma.user.findFirst({
        where: {userid: id}
    });
    const rating = await feedback.getAverageFeedbackByDoctorId(id);

    const profile = {
        id: id,
        name: user.name,
        email: user.email,
        phone: doctor.phone,
        specialty: doctor.specialty,
        covid: doctor.covidsupport,
        feedback: rating
    }

    //console.log(profile);

    return profile;
}


module.exports = {
    getAllDoctors,
    getDoctorById,
    getDoctorsBySpecialty,
    getAllDoctorProfiles,
    getDoctorProfileById
};