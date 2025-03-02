const { validationResult } = require('express-validator');
const { signUpValidator, logInValidator } = require('./validator');
const CustomError = require('../errors/customError.js');
const db  = import('../db/queries.js');

exports.handleMainPage = async (req, res) => {
  if (req.isAuthenticated()) {
    res.locals.currentUser = req.user;
    const folders = await (await db).getPrimaryFoldersDB(req.user.id);
    // return res.render('mainPageAuth', {folders: folders});

    return res.redirect(`/folder/${folders[0].id}`)
  } 
  res.render('mainPage')
};

exports.signUpQuery =  [
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
            errors: [{msg: 'Nickname already exist!'}]
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
  return res.render('mainPageAuth', {folders: primaryFolders, folder: folders});
} catch {
  next(new CustomError("Page not found. Maybe no such folder"))
}
};

exports.handleSubfolder = async (req, res) => {
  const primaryFolders = await (await db).getPrimaryFoldersDB(Number(req.user.id));
  const folders = await (await db).handleSubfolderDB(Number(req.params.subfolderId));
  res.locals.currentUser = req.user;
  res.locals.currentFolder = req.params.folderId;
  res.locals.currentSubfolder = req.params.subfolderId;
  return res.render('mainPageAuth', {folders: primaryFolders, folder: folders});
};

exports.moveFolderToTrash = async (req, res) => {
  await (await db).moveFolderToTrashDB(Number(req.params.subfolderId), req.user.id, Number(req.params.folderId));
};

exports.moveFolderFromTrash = async (req, res) => {
  await (await db).moveFolderFromTrashDB(Number(req.params.subfolderId), req.user.id, Number(req.params.folderId))
}