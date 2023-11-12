const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function getUnavailableDaysAfter(did, day) {
    const appts = await getAllAppointmentsAfterByDoctor(did, day);
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


async function getAvailableTimesOnByDoctor(did, day) {
    const appts = await getAllAppointmentsOnByDoctor(did, day);

    const availableTimes = []
    for(let i=0; i<8; i++) {
        const tempDate = new Date("2023-11-17T09:00:00.000-05:00");
        tempDate.setHours(tempDate.getHours()+i);
        availableTimes.push(tempDate);
    }

    console.log(availableTimes)
    
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


async function getAllAppointmentsBeforeByDoctor(did, day) {
    
}


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

    let apptsfinal = []
    for(let i=0; i<appts.length; i++) {
        if(appts[i].date.toDateString() !== day.toDateString()) {
            apptsfinal.push(appts[i])
        }
    }

    return apptsfinal;
}


async function getAllAppointmentsBeforeByPatient(pid, day) {

}


async function getAllAppointmentsAfterByPatient(pid, day) {

}


async function createAppointmentOn(day, pid, did, symptoms) {

}


module.exports = {
    getUnavailableDaysAfter,
    getAllAppointmentsAfterByDoctor,
    getAllAppointmentsAfterByPatient,
    getAllAppointmentsBeforeByDoctor,
    getAllAppointmentsBeforeByPatient,
    getAllAppointmentsOnByDoctor,
    getAvailableTimesOnByDoctor,
    createAppointmentOn
};