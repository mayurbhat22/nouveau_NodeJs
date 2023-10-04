//import { PrismaClient } from '@prisma/client'

//const prisma = new PrismaClient()
const express = require("express");
const cors = require('cors')
const bcrypt = require('bcrypt')
const salt=10;
const { PrismaClient } = require('@prisma/client')
const app = express();
const PORT = 8080;
const prisma = new PrismaClient();
app.use(cors({origin:true}))
//app.use(cors({ origin: "<http://localhost:3000>" }))
app.use(express.json())


app.get("/", (req, res) => {
  res.json({ message: 'Good evening'});
});

// Determine if there is already a user for the entered email
// path variable email - the email to be checked
// return - json message with boolean attribute unique - it is true if there is no account for the entered email
app.get("/registration/:email", async (req, res) => {

  const user = await prisma.user.findFirst({
    where: { email: req.params['email'] },
  })
  res.json({ unique: user == null})
})

// Add user to user table
// body - json of a user with schema as defined in schema.prisma
// return - 200 if adding to database is successful, otherwise failure code
app.post("/registration", async (req, res) => {
  const body = req.body;

  const hashPass = await bcrypt.hash(body.password, salt);

  await prisma.user.create({
    data: {
      name: body.name,
      role: body.role,
      email: body.email,
      password: hashPass,
      mfa: body.mfa,
    }
  })
  res.send()
})


// Attempt to log user in - Check if the email exists and that the password is correct
// body - json with fields email, password, and role
// return - 200 if the user can login and an appropriate code/error message otherwise
app.post('/login', async (req, res) => {
  const body = req.body;

  const user = await prisma.user.findFirst({
    where: { email: body.email },
  })

  if (user == null) {
    res.status(400);
    res.send("There is no user with that email");
    return;
  } 
  
  const valid = await bcrypt.compare(body.password, user.password)
  if(!valid) {
    res.status(400);
    res.send("Incorrect Password");
    return;
  }
  
  res.status(200);
  res.send();
})


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
})
