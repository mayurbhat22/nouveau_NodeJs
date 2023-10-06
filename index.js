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

app.use("/registration", registrationRoutes);

app.post("/login", async (req, res) => {
  const body = req.body;

  const user = await prisma.user.findFirst({
    where: { email: body.email },
  });

  if (user == null) {
    res.status(400);
    res.send("There is no user with that email");
    return;
  }

  const valid = await bcrypt.compare(body.password, user.password);
  if (!valid) {
    res.status(400);
    res.send("Incorrect Password");
    return;
  }

  res.status(200);
  res.send();
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
