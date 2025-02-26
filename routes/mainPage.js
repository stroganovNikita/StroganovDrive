const express = require('express');
const mainPageRouter = express.Router();
const mainPageController = require('../controllers/mainPageController');
const passport = require('passport');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});

mainPageRouter.get('/', (req, res) => { 
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user
        return res.render('mainPageAuth')
    } 
    res.render('mainPage')
});

mainPageRouter.get('/signUp', (req, res) => res.render('signUp'))
mainPageRouter.post('/signUp', mainPageController.signUpQuery);

mainPageRouter.get('/logIn', (req, res) => {

    if (req.session.messages.length > 0) {
        const error = req.session.messages[0];
        req.session.messages.splice(0);
        return res.status(400).render("logIn", {errors: [{msg: error}]});
    }
    console.log(req.session.messages)
    res.render('logIn')
});
mainPageRouter.post('/logIn', mainPageController.logInQuery, passport.authenticate('local', {successRedirect: "/", successMessage: undefined, failureRedirect: '/logIn', failureMessage: "No such username or password!"}));

mainPageRouter.get('/logOut', (req, res) => {
    req.logout();
    res.redirect('/');
})

mainPageRouter.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/')
})

module.exports = mainPageRouter