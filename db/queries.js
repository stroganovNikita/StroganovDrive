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
                create: [
                  {name: 'Personal'},
                  {name: 'Recently deleted'}
                ]
            }
        }
    })
};

const checkNicknameDB = async (nickName) => {
    return await prisma.user.findMany({
        where: {
            nickName: nickName
        }
    })
};

const getPrimaryFoldersDB = async (id) => {
  const folders = await prisma.folder.findMany({
    where: {
      authorId: id,
      parentFolder: null
    }
  });
  return folders
}

const handleFolderDB = async (id) => {
  const folder = await prisma.folder.findMany({
    where: {
      id: id,
      parentFolder: null
    },
    include: {
      childFolder: true
    }
  })
  // console.log(folder)
  return folder[0].childFolder
}

const handleSubfolderDB = async (id) => {
  const folder = await prisma.folder.findMany({
    where: {
      id: id
    },
    include: {
      childFolder: true
    }
  })

  return folder[0].childFolder
}




export { signUpQueryDB, checkNicknameDB, getPrimaryFoldersDB, handleFolderDB, handleSubfolderDB }


// await prisma.folder.update({
//     where: {
//        id: 4
//     },
//     data: {
//       name: "SQL"
//     }
// })
 
// const check = await prisma.folder.findMany({
//   include: {
//     childFolder: true
//   }
// });

// console.log(check)