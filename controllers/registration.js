const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasourceURL: 'sqlserver://nvhealth.database.windows.net:1433;database=nvdb;user=nvadmin;password=Nvhealth23;encrypt=true'});
const bcrypt = require("bcrypt");
const duo = require("../services/duo_interface");
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

// Attempt to sign user up - Check if the email exists and that the password is correct
// body - json with fields email, password, and role
// return - id of the user who was just signed up if successful and an appropriate code/error message otherwise
const registrationPostContoller = async (req, res) => {
  const body = req.body;

  const hashPass = await bcrypt.hash(body.password, salt);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      role: body.role,
      email: body.email,
      password: hashPass,
      mfa: body.mfa,
    },
  });


  res.json({userid: user.userid});
};

/* 
  Not really sure if this is necessary

// Check that duo is up
// no request parameters
// response body - returns the response from the duo api call, just an OK if the server is up and an error if it is not
const registrationDuoCheckGetController = async (req, res) => {
  
  const callback = (body, statusCode, statusMessage, error=false) => {
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    if(!error) {
      res.json(body)
      res.send()
    } else {
      res.send(body)
    }
  }

  duo.check(callback);
}
*/


// Attempt to enroll user in duo
// request body - userid of the user to enroll, used as username for user in duo
// response body - returns the response from the duo api call, including the url for the barcode, the activation code, and the user's duo id
//                 recommended to store the response (at least the duo id and the activation code) to check enroll status
const registrationDuoEnrollPostController = async (req, res) => {
  const body = req.body;

  const callback = (body, statusCode, statusMessage, error=false) => {
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    if(!error) {
      res.json(body)
      res.send()
    } else {
      res.send(body)
    }
  }

  duo.enroll(body.userid, callback)
}


// Check status of user's enrollment in duo
// request body - user_id DUO id (NOT the one in the db, returned when enroll is initially called) of the user being checked, activation_code the activation code from the enroll call
// response body - returns the response from the duo api call, just the status of the enrollment (success, invalid, or waiting)
const registrationDuoEnrollStatusPostController = async (req, res) => {
  const body = req.body;

  const callback = (body, statusCode, statusMessage, error=false) => {
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    if(!error) {
      res.json(body)
      res.send()
    } else {
      res.send(body)
    }
  }

  duo.enroll_status(body.user_id, body.activation_code, callback) 
}


// for users who opt out of enrolling in mfa when registering, set their mfa status to in the db
// request body - userid id of the user who we are disabling mfa for
// response body - returns the response from the duo api call, just the status of the enrollment (success, invalid, or waiting)
const registrationResetMFAController = async (req, res) => {
  const body = req.body
  const userid = typeof(body.userid) == 'string' ? parseInt(body.userid) : body.userid

  // set up admin api and delete user as well

  prisma.user.update({
    where: {
      userid: userid,
    },
    data: {
      mfa: false,
    },
  }).then((user) => {
    res.json({userid: parseInt(user.userid)})
    res.send()
  })
  .catch((e) => {
    res.statusCode = 400;
    res.send("User not found");
  });
}


module.exports = {
  registrationGetContoller,
  registrationPostContoller,
  registrationDuoEnrollStatusPostController,
  registrationDuoEnrollPostController,
  registrationResetMFAController
};
