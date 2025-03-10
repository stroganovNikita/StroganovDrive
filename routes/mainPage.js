const express = require('express');
const mainPageRouter = express.Router();
const mainPageController = require('../controllers/mainPageController');
const passport = require('passport');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mainPageRouter.get('/', mainPageController.handleMainPage);

mainPageRouter.get('/signUp', (req, res) => res.render('signUp'));
mainPageRouter.post('/signUp', mainPageController.signUpQuery);

mainPageRouter.get('/logIn', (req, res) => {  
    if (req.session.messages) {
        const error = req.session.messages[0];
        req.session.messages = undefined;
        return res.status(400).render("logIn", {errors: [{msg: error}]});
    }
    res.render('logIn')
});
mainPageRouter.post('/logIn', mainPageController.logInQuery, passport.authenticate('local', {successRedirect: "/", successMessage: undefined, failureRedirect: '/logIn', failureMessage: "No such username or password!"}));

mainPageRouter.get('/logOut', (req, res) => {
    req.logout();
    res.redirect('/');
})

mainPageRouter.post('/upload/:folderId/:subfolderId', upload.single('file'), mainPageController.uploadFile)

mainPageRouter.get('/folder/:id', mainPageController.handleFolder);

mainPageRouter.get('/folder/:folderId/subfolder/:subfolderId', mainPageController.handleSubfolder);

mainPageRouter.post('/delete/:folderId/:subfolderId', mainPageController.moveFolderToTrash);

mainPageRouter.post('/restore/:folderId/:subfolderId', mainPageController.moveFolderFromTrash);

mainPageRouter.post('/folder/:folderId/newFolder', (req, res) => {
    console.log("test")
})

mainPageRouter.post('/newFolder/:folderId/:subfolderId', mainPageController.createNewFolder);

mainPageRouter.post('/updateFolder/:folderId/:subfolderId', mainPageController.updateFolder);

mainPageRouter.post('/deleteFile/:folderId/:subfolderId/:fileId', mainPageController.deleteFile);

mainPageRouter.post('/restoreFile/:folderId/:subfolderId/:fileId', mainPageController.restoreFile);

mainPageRouter.post('/download/:fileName', mainPageController.downloadFile);

module.exports = mainPageRouter