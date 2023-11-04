//import { PrismaClient } from '@prisma/client'

//const prisma = new PrismaClient()
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const salt = 10;
const { PrismaClient } = require("@prisma/client");
const app = express();
const PORT = 8080;
const prisma = new PrismaClient();

app.use(cors({ origin: true }));
//app.use(cors({ origin: "<http://localhost:3000>" }))
app.use(express.json());


app.get("/", (req, res) => {

    res.json({ message: "Good evening" });
});


//Routes
const registrationRoutes = require("./routes/registration");
const loginRoutes = require("./routes/login");
const searchRoutes = require("./routes/search");

app.use("/registration", registrationRoutes);
app.use("/login", loginRoutes);
app.use("/search", searchRoutes);


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
