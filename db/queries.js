const { PrismaClient } = await import('@prisma/client');
console.log(PrismaClient)
const prisma = new PrismaClient();
const bcrypt = await import('bcryptjs');

const signUpQueryDB = async (firstName, lastName, nickName, password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            nickName: nickName,
            password: hashedPassword
        }
    })
};

const checkNickname = async (nickName) => {
    return await prisma.user.findMany({
        where: {
            nickName: nickName
        }
    })
};

export { signUpQueryDB, checkNickname }

const check = await prisma.user.findMany();
console.log(check)