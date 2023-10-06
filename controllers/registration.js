const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const salt = 10;

// Determine if there is already a user for the entered email
// path variable email - the email to be checked
// return - json message with boolean attribute unique - it is true if there is no account for the entered email
const registrationGetContoller = async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { email: req.params["email"] },
  });
  res.json({ unique: user == null });
};

// Attempt to log user in - Check if the email exists and that the password is correct
// body - json with fields email, password, and role
// return - 200 if the user can login and an appropriate code/error message otherwise
const registrationPostContoller = async (req, res) => {
  const body = req.body;

  const hashPass = await bcrypt.hash(body.password, salt);

  await prisma.user.create({
    data: {
      name: body.name,
      role: body.role,
      email: body.email,
      password: hashPass,
      mfa: body.mfa,
    },
  });
  res.send();
};

module.exports = {
  registrationGetContoller,
  registrationPostContoller,
};
