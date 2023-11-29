const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getUserById(userid) {
    const user = await prisma.user.findFirst({
        where: {
            userid: userid
        }
    })

    return user;
}

module.exports = {
    getUserById
}