const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const duo = require("../services/duo_interface");
const salt = 10;

// Attempt to log user in - Check if the email exists and that the password is correct
// body - json with fields email, password, and role
// return - if unsuccessful, appropriate error message, otherwise the id and mfa status of the user who just logged in
//          if the mfa status is true, then perform preauthentication and add the 
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
    if (!valid) {
      res.status(400);
      res.send("Incorrect Password");
      return;
    }
  
    var responseBody = {
        userid: user.userid,
        mfa: user.mfa,
        role: user.role
    }

    if (user.mfa == false) {
        res.status(200);
        res.json(responseBody)
        res.send();
        return;
    }

    const callback = (body, statusCode, statusMessage, error=false) => {
        res.statusCode = statusCode;
        res.statusMessage = statusMessage;
        if(!error) {
            body['userid'] = responseBody.userid
            body['mfa'] = responseBody.mfa
            body['role'] = responseBody.role
            res.json(body)
            res.send()
        } else {
            
        }
      }
    
    duo.preauth(user.userid, callback);
};


// Authorize user with duo mfa
// request body - userid of the user to authorize, 
// response body - returns the response from the duo api call, including the status of the authentication, and the status message to display to the user
const loginDuoAuthPostController = async (req, res) => {
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

  duo.auth(body.userid, callback)
}


// Check status of authentication with duo
// request body - txid returned from initial auth, 
// response body - returns the response from the duo api call, including the status of the authentication, and the status message to display to the user
const loginDuoAuthStatusPostController = async (req, res) => {
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
  
    duo.auth_status(body.txid, callback)
  }


module.exports = {
  loginPostController,
  loginDuoAuthStatusPostController,
  loginDuoAuthPostController
};
