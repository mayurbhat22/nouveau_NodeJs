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


async function postFeedback(feedback){
    const givenFeedback = await getFeedbackByDoctorIdAndPatientId(feedback.doctorid, feedback.patientid);

    // replace old feedback if it exists
    if (givenFeedback !== null) {
        const oldFeedback = await prisma.feedback.delete({
            where: { 
                patientid_doctorid: {
                    patientid:  feedback.patientid,
                    doctorid: feedback.doctorid,
                }
            }
        })
    }

    const newfeedback = await prisma.feedback.create({
        data: {
            doctorid: feedback.doctorid,
            patientid: feedback.patientid,
            rating: feedback.rating,
            written: feedback.written
        }
    })

    return newfeedback
}


module.exports = {
    getFeedbackByDoctorId,
    getFeedbackByDoctorIdAndPatientId,
    getAverageFeedbackByDoctorId,
    postFeedback
};