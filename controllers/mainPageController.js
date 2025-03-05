const { validationResult } = require('express-validator');
const { signUpValidator, logInValidator } = require('./validator');
const CustomError = require('../errors/customError.js');
const db = import('../db/queries.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.handleMainPage = async (req, res) => {
  if (req.isAuthenticated()) {
    res.locals.currentUser = req.user;
    const folders = await (await db).getPrimaryFoldersDB(req.user.id);
    return res.redirect(`/folder/${folders[0].id}`)
  }
  res.render('mainPage')
};

exports.signUpQuery = [
  signUpValidator,
  async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, nickName, password } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("signUp", {
        title: "Create user",
        errors: errors.array()
      })
    }
    const test = await (await db).checkNicknameDB(nickName)
    if (test.length > 0) {
      return res.status(400).render('signUp', {
        errors: [{ msg: 'Nickname already exist!' }]
      })
    }
    (await db).signUpQueryDB(firstName, lastName, nickName, password);
    res.redirect('logIn')
  }
];

exports.logInQuery = [
  logInValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    const { nickName, password } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("logIn", {
        title: 'Login user',
        errors: errors.array()
      });
    }
    next()
  }
];

exports.handleFolder = async (req, res, next) => {
  try {
    const primaryFolders = await (await db).getPrimaryFoldersDB(req.user.id);
    const folders = await (await db).handleFolderDB(Number(req.params.id));
    res.locals.currentUser = req.user;
    res.locals.currentFolder = req.params.id;
    return res.render('mainPageAuth', { folders: primaryFolders, folder: folders.childFolder, file: folders.file });
  } catch {
    next(new CustomError("Page not found. Maybe no such folder"))
  }
};

exports.handleSubfolder = async (req, res, next) => {
  try {
    const primaryFolders = await (await db).getPrimaryFoldersDB(Number(req.user.id));
    const folders = await (await db).handleSubfolderDB(Number(req.params.subfolderId));
    const path = await (await db).pathToRootDB(Number(req.params.subfolderId));
    res.locals.currentUser = req.user;
    res.locals.currentFolder = req.params.folderId;
    res.locals.currentSubfolder = req.params.subfolderId;
    console.log(primaryFolders)
    return res.render('mainPageAuth', { folders: primaryFolders, folder: folders.childFolder, file: folders.file ,path: path.splice(1) });
  } catch {
    next(new CustomError("Page not found. Maybe no such folder"))
  }
};

exports.moveFolderToTrash = async (req, res) => {
  const parentFolder = await (await db).getParentFolderDB(Number(req.params.subfolderId, req.user.id));
  await (await db).moveFolderToTrashDB(Number(req.params.subfolderId), req.user.id, Number(req.params.folderId));
  if (parentFolder.name == 'Personal') {
    res.redirect(`/folder/${req.params.folderId}`);
  } else {
    res.redirect(`/folder/${req.params.folderId}/subfolder/${parentFolder.id}`)
  }
};

exports.moveFolderFromTrash = async (req, res) => {
  try {
    const parentFolder = await (await db).getParentFolderDB(Number(req.params.subfolderId, req.user.id));
    await (await db).moveFolderFromTrashDB(Number(req.params.subfolderId), req.user.id, Number(req.params.folderId))
    if (parentFolder.name == 'Personal') {
      res.redirect(`/folder/${req.params.folderId}`);
    } else {
      res.redirect(`/folder/${req.params.folderId}/subfolder/${parentFolder.id}`)
    }
  } catch {
    next(new CustomError("Error move, please write to the developer"))
  }
};

exports.createNewFolder = async (req, res, next) => {
  try {
    if (req.params.subfolderId == 'none') {
      await (await db).createNewFolderDB(Number(req.params.folderId), req.user.id, req.body.newFolder);
      res.redirect(`/folder/${req.params.folderId}`)
    } else {
      await (await db).createNewFolderDB(Number(req.params.subfolderId), req.user.id, req.body.newFolder);
      res.redirect(`/folder/${req.params.folderId}/subfolder/${req.params.subfolderId}`)
    }
  } catch {
    next(new CustomError("Error during creation, please write to the developer"))
  }
};

exports.updateFolder = async (req, res, next) => {
  try {
    const parentFolder = await (await db).getParentFolderDB(Number(req.params.subfolderId, req.user.id));
    await (await db).updateFolderNameDB(Number(req.params.subfolderId), req.user.id, req.body.newName);
    if (parentFolder.name == 'Personal') {
      res.redirect(`/folder/${req.params.folderId}`);
    } else {
      res.redirect(`/folder/${req.params.folderId}/subfolder/${parentFolder.id}`)
    }
  } catch {
    next(new CustomError("Error during update, please write to the developer"))
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    if (req.params.subfolderId == 'none') { 
      await (await db).uploadFileDB(Number(req.params.folderId), req.user.id, req.file)
      res.redirect(`/folder/${req.params.folderId}`);
    } else {
      await (await db).uploadFileDB(Number(req.params.subfolderId), req.user.id, req.file)
      res.redirect(`/folder/${req.params.folderId}/subfolder/${req.params.subfolderId}`)
    } 
  } catch {
      next(new CustomError("Error during upload, please write to the developer"));
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const primaryFolders = await (await db).getPrimaryFoldersDB(Number(req.user.id));
    await (await db).deleteFileDB(Number(req.params.fileId), primaryFolders[1].id);
    if (req.params.subfolderId == 'none') {
      res.redirect(`/folder/${req.params.folderId}`)
    } else {
      res.redirect(`/folder/${req.params.folderId}/subfolder/${req.params.subfolderId}`)
    }
  } catch {
    next(new CustomError('Error during delete file, please write to the developer'));
  }
};

exports.restoreFile = async (req, res, next) => {
  try {
    const parentFolderForFile = await (await db).getParentFolderForFileDB(Number(req.params.fileId));
    const primaryFolders = await (await db).getPrimaryFoldersDB(Number(req.user.id));

    if(primaryFolders[1].id == parentFolderForFile.folderId) {
      await (await db).restoreFileDB(Number(req.params.fileId), primaryFolders[0].id);
      if (req.params.subfolderId == 'none') {
        res.redirect(`/folder/${req.params.folderId}`);
      } else {
        res.redirect(`/folder/${req.params.folderId}/subfolderId/${req.params.subfolderId}`);
      }
    } 
  } catch {
    next(new CustomError('Oops, something wont wrong. Write please to the developer'))
  }
};