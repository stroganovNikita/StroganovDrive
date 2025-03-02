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

async function moveFolderToTrashDB(id, userId, parentFolder) {
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
  const recentlyDeleteFolder = await prisma.folder.findMany({
    where: {
      authorId: userId,
      name: 'Recently deleted',
      parentFolder: null
    }
  })
  await prisma.folder.update({
    where: {
      id: id
    },
    data: {
      parentFolder: recentlyDeleteFolder[0].id
    }
  })
 }
};

async function moveFolderFromTrashDB(id, userId) {
  const personalFolder = await prisma.folder.findMany({
    where: {
      authorId: userId,
      name: 'Personal',
      parentFolder: null
    }
   });
  await prisma.folder.update({
    where: {
      id: id
    },
    data: {
      parentFolder: personalFolder[0].id
    }
  });
};

export { 
  signUpQueryDB, 
  checkNicknameDB, 
  getPrimaryFoldersDB, 
  handleFolderDB, 
  handleSubfolderDB, 
  moveFolderToTrashDB,
  moveFolderFromTrashDB
}


//  const check = await prisma.folder.update({
//     where: {
//        id: 3
//     },
//     data: {
//       childFolder: {
//         create: {
//           name: 'XSS3', authorId: 1 
//         }
//       }
//     }
// })
 
// const check = await prisma.folder.findMany({
//   include: {
//     childFolder: true
//   }
// });

// console.log(check)