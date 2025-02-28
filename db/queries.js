const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = await import('bcryptjs');

async function signUpQueryDB(firstName, lastName, nickName, password) {
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

async function checkNicknameDB(nickName) {
    return await prisma.user.findMany({
        where: {
            nickName: nickName
        }
    })
};

async function getPrimaryFoldersDB(id) {
  return await prisma.folder.findMany({
    where: {
      authorId: id,
      parentFolder: null
    }
  });
};

async function handleFolderDB(id) {
  const folder = await prisma.folder.findMany({
    where: {
      id: id,
      parentFolder: null
    },
    include: {
      childFolder: true
    }
  })
  return folder[0].childFolder
};

async function handleSubfolderDB(id) {
  const folder = await prisma.folder.findMany({
    where: {
      id: id
    },
    include: {
      childFolder: true
    }
  })
  return folder[0].childFolder
};

async function moveFolderDB(id, userId, parentFolder) {
  const test = await prisma.folder.findUnique({
    where: {
      id: parentFolder
    }
  })
if (test.name == "Recently deleted") {
  await prisma.folder.delete({
    where: {
      id: id
    }
  })
} else {
  const movedFolder = await prisma.folder.findUnique({
    where: {
      id: id
    }
  })
  const recentlyDeleteFolder = await prisma.folder.findMany({
    where: {
      authorId: userId,
      name: 'Recently deleted',
      parentFolder: null
    }
   })
  await prisma.folder.update({
    where: {
      id: recentlyDeleteFolder[0].id
    },
    data: {
      childFolder: {
        create: {
          name: movedFolder.name,
          authorId: userId
        }
      }
    }
  })
  await prisma.folder.delete({
    where: {
      id: movedFolder.id
    }
  })
}
};

export { 
  signUpQueryDB, 
  checkNicknameDB, 
  getPrimaryFoldersDB, 
  handleFolderDB, 
  handleSubfolderDB, 
  moveFolderDB
}


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