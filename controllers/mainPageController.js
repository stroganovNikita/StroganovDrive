const { validationResult } = require('express-validator');
const { signUpValidator, logInValidator } = require('./validator');
const db  = import('../db/queries.js');

exports.handleMainPage = async (req, res) => {
  if (req.isAuthenticated()) {
    res.locals.currentUser = req.user
    const folders = await (await db).getPrimaryFoldersDB(req.user.id)
    return res.render('mainPageAuth', {folders: folders})
} 
res.render('mainPage')
}

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

exports.handleFolder = async (req, res) => {
  const primaryFolders = await (await db).getPrimaryFoldersDB(req.user.id);
  const folders = await (await db).handleFolderDB(Number(req.params.id));
  res.locals.currentUser = req.user
  res.locals.currentFolder = req.params.id;
  // console.log(primaryFolders + ' / ' + folders)
  return res.render('mainPageAuth', {folders: primaryFolders, folder: folders});
}

exports.handleSubfolder = async (req, res) => {
  const primaryFolders = await (await db).getPrimaryFoldersDB(Number(req.params.folderId));
  const folders = await (await db).handleSubfolderDB(Number(req.params.subfolderId));
  res.locals.currentUser = req.user;
  res.locals.currentFolder = req.params.folderId;
  return res.render('mainPageAuth', {folders: primaryFolders, folder: folders});
}