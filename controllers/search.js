const doctordb = require("../services/doctor");

// Return doctors that match search ordered by how well they match (ideally)
// body - json with search terms and whether the search should filter out doctors who don't support covid care
// return - if unsuccessful, appropriate error message, otherwise profile info for every doctor returned by the search
const searchPostController = async (req, res) => {
  const body = req.body;

  const profiles = await doctordb.getAllDoctorProfiles();
  console.log(profiles);
  const searchReturn = [];

  for (let i = 0; i < profiles.length; i++) {
    var currentProf = profiles[i];
    if (typeof currentProf === "object" && !Array.isArray(currentProf)) {
      if (
        (currentProf.name
          .toLowerCase()
          .includes(body.searchTerms.toLowerCase()) ||
          currentProf.specialty
            .toLowerCase()
            .includes(body.searchTerms.toLowerCase())) &&
        (currentProf.covid || !body.filters.covid)
      ) {
        searchReturn.push(currentProf);
      }
    }
  }

  res.json(searchReturn);
  res.send();
};

module.exports = {
  searchPostController,
};
