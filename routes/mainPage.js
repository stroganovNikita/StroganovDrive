const express = require('express');
const mainPageRouter = express.Router();

mainPageRouter.get('/', (req, res) => res.render('mainPage'))

module.exports = mainPageRouter