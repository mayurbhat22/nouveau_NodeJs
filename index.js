//import { PrismaClient } from '@prisma/client'

//const prisma = new PrismaClient()
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const salt = 10;
const { PrismaClient } = require("@prisma/client");
const app = express();
const PORT = 8080;
const prisma = new PrismaClient();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(cookieParser());
//app.use(cors({ origin: "<http://localhost:3000>" }))
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Good evening" });
});

//Routes
const registrationRoutes = require("./routes/registration");
const loginRoutes = require("./routes/login");

app.use("/registration", registrationRoutes);
app.use("/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
