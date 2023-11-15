const express = require("express");
const router = express.Router();

const {
    searchPostController,
} = require("../controllers/search");

router.post("/", searchPostController);
module.exports = router;
