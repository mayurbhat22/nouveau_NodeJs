const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const feedback = require("./feedback");
const userdb = require("./user");

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
    if(user===null) {
        return "There is no user with that id"
    } else if (user.role !== 'doctor') {
        return "This user is not a doctor"
    }

    const rating = await feedback.getAverageFeedbackByDoctorId(id);

    const profile = {
        id: id,
        name: user.name,
        email: user.email,
        phone: doctor?.phone,
        specialty: doctor?.specialty,
        covid: doctor?.covidsupport,
        feedback: rating
    }

    if(profile.phone !== undefined ) {
        profile.phone = Number(profile.phone)
    }

    //console.log(profile);

    return profile;
}


// updates doctor profile if it exists and creates it if it doesn't
async function upsertDoctorProfile(doctor) {
    /*
    const newUser = await prisma.user.update({
        where: {
            userid: doctor.doctorid
        },
        data: {
            email: doctor.email
        }
    })
    */

    const checkUser = await userdb.getUserById(doctor.doctorid);
    if (checkUser.role !== 'doctor') {
        return "This user is not a doctor"
    }

    const newUser = await userdb.updateUser({
        userid: doctor.doctorid,
        email: doctor.email,
        name: doctor.name,
        oldPassword: doctor.oldPassword,
        newPassword: doctor.newPassword
    })

    if(typeof newUser === 'string') {
        return newUser;
    }
    


    const newDoctor = await prisma.doctor.upsert({
        where: {
            doctorid: doctor.doctorid
        },
        create: {
            doctorid: doctor.doctorid,
            specialty: doctor.specialty,
            covidsupport: doctor.covidsupport,
            phone: doctor.phone,
        },
        update: {
            specialty: doctor.specialty,
            covidsupport: doctor.covidsupport,
            phone: doctor.phone,
        }
    })

    return doctor;
}


module.exports = {
    getAllDoctors,
    getDoctorById,
    getDoctorsBySpecialty,
    getAllDoctorProfiles,
    getDoctorProfileById,
    upsertDoctorProfile
};