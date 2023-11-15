const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const doctordb = require("./doctor");


// gives all days where a doctor is fully booked
async function getUnavailableDaysAfter(did, day) {
    const appts = await getAllAppointmentsAfterNotIncludingByDoctor(did, day);
    //console.log(appts);

    const apptMap = new Map();
    const unavailableDays = [];

    for(let i=0; i<appts.length; i++) {
        let dateString = appts[i].date.toDateString()
        if(apptMap.get(dateString) === undefined) {
            apptMap.set(dateString, 1);
        } else {
            apptMap.set(dateString, apptMap.get(dateString)+1);
            if(apptMap.get(dateString) > 7) {
                unavailableDays.push(appts[i].date);
            }
        }
    }

    //console.log(apptMap)

    return unavailableDays;
}


// gives all appointments after a specific day, excluding any appointments on that day
async function getAllAppointmentsAfterNotIncludingByDoctor(did, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                gte: day
            }, 
            doctorid: did
        },
        orderBy: {
            date: 'asc'
        }
    })

    let apptsfinal = []
    for(let i=0; i<appts.length; i++) {
        if(appts[i].date.toDateString() !== day.toDateString()) {
            apptsfinal.push(appts[i])
        }
    }

    return apptsfinal;
}


// gives all times (as part of dates) where the doctor does not have an appointment on a given day
async function getAvailableTimesOnByDoctor(did, day) {
    const appts = await getAllAppointmentsOnByDoctor(did, day);

    const availableTimes = []
    for(let i=0; i<8; i++) {
        const tempDate = new Date("2023-11-17T09:00:00.000-05:00");
        tempDate.setHours(tempDate.getHours()+i);
        availableTimes.push(tempDate);
    }

    //console.log(availableTimes)
    
    for(let i=0; i<appts.length; i++) {
        const currentDate = appts[i].date.toTimeString();
        for(let j=0; j<availableTimes.length; j++) {
            if(currentDate === availableTimes[j].toTimeString()) {
                availableTimes.splice(j, 1);
                break;
            }
        }
    }

    
    return availableTimes;
}


// gives all appointments on a specific day, ignoring the time
async function getAllAppointmentsOnByDoctor(did, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            doctorid: did
        }
    })

    const todayAppts = []
    for(let i=0; i<appts.length; i++) {
        if(day.toDateString() === appts[i].date.toDateString()) {
            todayAppts.push(appts[i]);
        }
    }

    //console.log(todayAppts);

    return todayAppts;
}


// gives all appointments before and not including a specific date and time (so if the entered time is 12:00 on Nov 11, it will give all appointments from Nov 11 at 11:00 and before)
async function getAllAppointmentsBeforeByDoctor(did, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                lt: day
            }, 
            doctorid: did
        },
        orderBy: {
            date: 'asc'
        }
    })

    return appts;
}


// gives all appointments before and not including a specific date and time (so if the entered time is 12:00 on Nov 11, it will give all appointments from Nov 11 at 11:00 and before)
async function getAllAppointmentsBeforeByPatient(pid, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                lt: day
            }, 
            patientid: pid
        },
        orderBy: {
            date: 'asc'
        }
    })

    return appts;
}



// gives all appointments after and including a specific date and time (so if the entered time is 12:00 on Nov 11, it will give all appointments from Nov 11 at 12:00 and after)
async function getAllAppointmentsAfterByDoctor(did, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                gte: day
            }, 
            doctorid: did
        },
        orderBy: {
            date: 'asc'
        }
    })

    return appts;
}


// gives all appointments after and including a specific date and time (so if the entered time is 12:00 on Nov 11, it will give all appointments from Nov 11 at 12:00 and after)
async function getAllAppointmentsAfterByPatient(pid, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                gte: day
            }, 
            patientid: pid
        },
        orderBy: {
            date: 'asc'
        }
    })

    return appts;
}


// gives all appointments on a specific day, ignoring the time
async function getAllAppointmentsOnByPatient(pid, day) {
    const origHours = day.getHours();
    day.setHours(0);
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                gte: day
            }, 
            patientid: pid
        },
        orderBy: {
            date: 'asc'
        }
    })

    let apptsfinal = []
    for(let i=0; i<appts.length; i++) {
        if(appts[i].date.toDateString() === day.toDateString()) {
            apptsfinal.push(appts[i])
        }
    }

    day.setHours(origHours);

    return appts;
}


// INCOMPLETE - NEED COMPLETED PATIENT PROFILES
// gets all patients for a given doctor that they have had an appointment with before the given date and time (will probably always be current date and time, but will leave it open just in case), not inclusive
async function getAllPatientsUpToPresent(did, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                lt: day
            }, 
            doctorid: did
        },
        orderBy: {
            date: 'asc'
        },
        distinct: ['patientid']
    })

    const profiles = [];
    for(let i=0; i<appts.length; i++) {
        //const prof = await doctordb.getDoctorProfileById(appts[i].doctorid)
        //profiles.push(prof);
        profiles.push(appts[i].patientid);
    }

    return profiles;
}


// INCOMPLETE - NEED COMPLETED PATIENT PROFILES
// gets all patients for a given doctor that they have had an appointment with or have an appointment scheduled with
async function getAllPatientsAllTime(did) {
    const appts = await prisma.appointments.findMany({
        where: {
            doctorid: did
        },
        orderBy: {
            date: 'asc'
        },
        distinct: ['patientid']
    })

    const profiles = [];
    for(let i=0; i<appts.length; i++) {
        //const prof = await doctordb.getDoctorProfileById(appts[i].doctorid)
        //profiles.push(prof);
        profiles.push(appts[i].patientid);
    }

    return profiles;
}


// gets all doctors for a given patient that they have had an appointment with before the given date and time (will probably always be current date and time, but will leave it open just in case), not inclusive
async function getAllDoctorsUpToPresent(pid, day) {
    const appts = await prisma.appointments.findMany({
        where: {
            date: {
                lt: day
            }, 
            patientid: pid
        },
        orderBy: {
            date: 'asc'
        },
        distinct: ['doctorid']
    })

    const profiles = [];
    for(let i=0; i<appts.length; i++) {
        const prof = await doctordb.getDoctorProfileById(appts[i].doctorid)
        profiles.push(prof);
    }

    return profiles;
}


// gets all doctors for a given patient that they have had an appointment with or have an appointment scheduled with
async function getAllDoctorsAllTime(pid) {
    const appts = await prisma.appointments.findMany({
        where: {
            patientid: pid
        },
        orderBy: {
            date: 'asc'
        },
        distinct: ['doctorid']
    })

    const profiles = [];
    for(let i=0; i<appts.length; i++) {
        const prof = await doctordb.getDoctorProfileById(appts[i].doctorid)
        profiles.push(prof);
    }

    return profiles;
}


// creates appointment using information that is passed to it
async function createAppointmentOn(apptinfo) {
    const day = new Date(apptinfo.date);

    const availableTimes = await getAvailableTimesOnByDoctor(apptinfo.doctorid, day);
    
    let avail = false;
    for(let i=0; i<availableTimes.length; i++) {
        if(availableTimes[i].getHours() === day.getHours()) {
            avail = true;
        }
    }
    if(!avail) {
        return "Doctor already has an appointment at that time";
    }

    const patientAppts = await getAllAppointmentsOnByPatient(apptinfo.patientid, day);
    avail = true;
    for(let i=0; i<patientAppts.length; i++) {
        const tempDate = patientAppts[i].date;
        if(tempDate.toDateString() === day.toDateString() && tempDate.getHours() === day.getHours()) {
            avail = false;
        }
    }
    if(!avail) {
        return "Patient already has an appointment at that time"
    }

    let apptid = -1;

    try {
        apptid = await prisma.appointments.create({
            data: {
                patientid: apptinfo.patientid,
                doctorid: apptinfo.doctorid,
                date: day,
                covidtest: apptinfo.covidtest,
                symptoms: apptinfo.symptoms
            }
        })
    } catch (error) {
        apptid = error.message
        return apptid;
    }

    return apptid.apptid;
}


// creates a covid form associated with the given appointment using the information provided
async function createCovidForm(apptid, forminfo) {
    let formid = -1;

    try {
        formid = await prisma.covidforms.create({
            data: {
                apptid: apptid,
                temp: forminfo.temp,
                cough: forminfo.cough,
                breathing: forminfo.breathing,
                contact: forminfo.contact,
                travel: forminfo.travel
            }
        }) 
    } catch (error) {
        formid = error.message
        return formid;
    }

    return formid.apptid;
}


module.exports = {
    getUnavailableDaysAfter,
    getAllAppointmentsAfterByDoctor,
    getAllAppointmentsAfterNotIncludingByDoctor,
    getAllAppointmentsAfterByPatient,
    getAllAppointmentsBeforeByDoctor,
    getAllAppointmentsBeforeByPatient,
    getAllAppointmentsOnByDoctor,
    getAvailableTimesOnByDoctor,
    getAllDoctorsAllTime,
    getAllDoctorsUpToPresent,
    getAllPatientsAllTime,
    getAllPatientsUpToPresent,
    createAppointmentOn,
    createCovidForm
};