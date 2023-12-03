const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const salt = 10;

async function getUserById(userid) {
  const user = await prisma.user.findFirst({
    where: {
      userid: userid,
    },
  });

  return user;
}


async function getUserByEmail(email) {
    const users = await prisma.user.findMany({
    })

    for (let i=0; i<users.length; i++) {
        if (users[i].email === email) {
            return users[i];
        }
    }

  return null;
}


async function updateUser(inuser) {
    const checkUser = await getUserById(inuser.userid);
    if(checkUser === null) {
        return "There is no user with that id"
    }

    const checkUser2 = await getUserByEmail(inuser.email)
    if (checkUser2 !== null && checkUser2.userid !== inuser.userid) {
        return "There is already a user with that email"
    }


    if(inuser.oldPassword === undefined) {
        const newUser = await prisma.user.update({
            where: {
                userid: inuser.userid
            },
            data: {
                name: inuser.name,
                email: inuser.email
            }
        })

        return newUser;
    }

    const valid = await bcrypt.compare(inuser.oldPassword, checkUser.password);
    if (!valid) {
        return "Old password is not correct"
    }
    
    const hashPass = await bcrypt.hash(inuser.newPassword, salt);

    const newUser = await prisma.user.update({
        where: {
            userid: inuser.userid
        },
        data: {
            name: inuser.name,
            email: inuser.email,
            password: hashPass
        }
    })

    return newUser;
}

module.exports = {
  getUserById,
    getUserByEmail,
    updateUser,
};
