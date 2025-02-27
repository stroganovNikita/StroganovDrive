const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = await import('bcryptjs');

const signUpQueryDB = async (firstName, lastName, nickName, password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            nickName: nickName,
            password: hashedPassword,
            folder: {
                create: {
                  name: 'Primary Folder'
               }
            }
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

const getFolders = async (id) => {
  const folders = await prisma.folder.findMany({
    where: {
      authorId: id,
    }
  });
  return folders
}

export { signUpQueryDB, checkNickname, getFolders }


// await prisma.folder.update({
//     where: {
//         id: 2
//     },
//     data: {
//         childFolder: {
//               create: {
//                   name: 'Primary Folder - exactly',
//                   authorId: 2,
//             }
//         }
//     }
// })

const check = await prisma.folder.findMany({
    where: {
        authorId: 2,
    }
});
console.log(check)