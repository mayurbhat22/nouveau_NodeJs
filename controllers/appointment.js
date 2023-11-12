const { now } = require("moment");
const appointmentdb = require("../services/appointment");

// Return doctors that match search ordered by how well they match (ideally)
// body - json with search terms and whether the search should filter out doctors who don't support covid care
// return - if unsuccessful, appropriate error message, otherwise profile info for every doctor returned by the search
const appointmentGetUnavailableDaysPostController = async (req, res) => {
    const body = req.body;

    //let today = new Date;
    let day = new Date(body.date);
    //let day = body.date;
    const dates = await appointmentdb.getUnavailableDaysAfter(body.doctorid, day);

    res.json(dates);
    res.send();
};


const appointmentGetAvailableTimesPostController = async (req, res) => {
    const body = req.body;

    //let today = new Date;
    let day = new Date(body.date);
    //let day = body.date;
    const dates = await appointmentdb.getAvailableTimesOnByDoctor(body.doctorid, day);

    res.json(dates);
    res.send();
}

const appointmentBookAppointmentPostController = async (req, res) => {

}



module.exports = {
    appointmentBookAppointmentPostController,
    appointmentGetAvailableTimesPostController,
    appointmentGetUnavailableDaysPostController
};