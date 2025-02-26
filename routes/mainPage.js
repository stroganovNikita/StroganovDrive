const express = require('express');
const mainPageRouter = express.Router();
const mainPageController = require('../controllers/mainPageController');

mainPageRouter.get('/', (req, res) => res.render('mainPage'));

mainPageRouter.get('/signUp', (req, res) => res.render('signUp'))
mainPageRouter.post('/signUp', mainPageController.signUpQuery);

mainPageRouter.get('/logIn', (req, res) => res.render('logIn'))

module.exports = mainPageRouter