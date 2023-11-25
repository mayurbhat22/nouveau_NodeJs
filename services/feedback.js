const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getFeedbackByDoctorId(id) {
    const feedback = await prisma.feedback.findMany({
        where: {
            doctorid: id
        }
    })

    return feedback
}


async function getFeedbackByDoctorIdAndPatientId(did, pid) {
    const feedback = await prisma.feedback.findFirst({
        where: {
            doctorid: did,
            patientid: pid
        }
    })

    return feedback;
}


async function getAverageFeedbackByDoctorId(id) {
    const feedback = await getFeedbackByDoctorId(id);
    sum = 0;
    for(let i=0; i<feedback.length; i++) {
        sum += feedback[i].rating;
    }

    return feedback.length > 0 ? `${sum/feedback.length}/5` : "No Reviews Yet";
}


module.exports = {
    getFeedbackByDoctorId,
    getFeedbackByDoctorIdAndPatientId,
    getAverageFeedbackByDoctorId
};