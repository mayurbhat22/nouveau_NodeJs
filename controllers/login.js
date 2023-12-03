const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const duo = require("../services/duo_interface");
const salt = 10;
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "881661732927-7vr8rkb2i0q11h5te0idk6ucvim2fro3.apps.googleusercontent.com";
const client = new OAuth2Client();
let REGISTRATION_URL = "http://localhost:8080/registration";
// Attempt to log user in - Check if the email exists and that the password is correct
// body - json with fields email, password, and role
// return - if unsuccessful, appropriate error message, otherwise the id and mfa status of the user who just logged in
//        if the mfa status is true, then perform preauthentication and add the
const loginPostController = async (req, res) => {
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
  console.log(valid);
  if (!valid) {
    res.status(400);
    res.send("Incorrect Password");
    return;
  }

  if (user.mfa == false) {
    res.status(200);
    res.json(user);
    res.send();
    return;
  }

  const callback = (body, statusCode, statusMessage, error = false) => {
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    if (!error) {
      body["userid"] = user.userid;
      body["name"] = user.name;
      body["email"] = user.email;
      body["mfa"] = user.mfa;
      body["role"] = user.role;
      res.json(body);
      res.send();
    } else {
    }
  };

  duo.preauth(user.userid, callback);
};

// Authorize user with duo mfa
// request body - userid of the user to authorize,
// response body - returns the response from the duo api call, including the status of the authentication, and the status message to display to the user
const loginDuoAuthPostController = async (req, res) => {
  const body = req.body;

  const callback = (body, statusCode, statusMessage, error = false) => {
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    if (!error) {
      res.json(body);
      res.send();
    } else {
      res.send(body);
    }
  };

  duo.auth(body.userid, callback);
};

// Check status of authentication with duo
// request body - txid returned from initial auth,
// response body - returns the response from the duo api call, including the status of the authentication, and the status message to display to the user
const loginDuoAuthStatusPostController = async (req, res) => {
  const body = req.body;

  const callback = (body, statusCode, statusMessage, error = false) => {
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    if (!error) {
      res.json(body);
      res.send();
    } else {
      res.send(body);
    }
  };

  duo.auth_status(body.txid, callback);
};

//Google Auth
const loginGoogleAuth = async (req, res) => {
  const body = req.body;
  const token = body.id_token;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(payload.email);

  const user = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  const userid = payload["sub"];

  // First check whether the user through Google Auth has Signed up.
  // If Signed Up, that user and email will be already in the Db.
  // So, we have to check, if that user should be registered first, or directly log in.
  axios({
    method: "get",
    url: REGISTRATION_URL + "/" + payload.email,
  }).then(
    (getresponse) => {
      console.log("GOT THE EMAIl");
      if (getresponse.data?.unique == true) {
        // If the user is logging in for the first time, then register him in the Db
        axios({
          method: "post",
          url: REGISTRATION_URL,
          data: {
            name: payload.name,
            email: payload.email,
            role: body.roleName,
            password: "Mayur",
            mfa: false,
          },
        }).then((response) => {
          console.log("Registration response:", response.data);
          res.cookie("session-token", token);
          body["userid"] = response.data.userid;
          body["name"] = payload.name;
          body["email"] = payload.email;
          body["role"] = body.roleName;
          res.json(body);
        });
      } else {
        body["userid"] = user.userid;
        body["name"] = user.name;
        body["email"] = user.email;
        body["mfa"] = user.mfa;
        body["role"] = user.role;
        res.json(body);
      }
    },
    (error) => {
      console.log(error);
    }
  );
};

const logoutGoogleAuth = async (req, res) => {
  res.clearCookie("session-token");
  res.statusCode = 200;
  res.send("Maga Clear aytuu");
};

module.exports = {
  loginPostController,
  loginDuoAuthStatusPostController,
  loginDuoAuthPostController,
  loginGoogleAuth,
};
