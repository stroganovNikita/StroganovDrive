/*Imports and configure*/
const express = require('express');
const mainPageRouter = require('./routes/mainPage')
require('dotenv').config();
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));


/*Route(s)*/
app.use(mainPageRouter)


/*Configure too*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 8000
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));