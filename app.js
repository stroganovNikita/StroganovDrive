/*Imports*/
const express = require('express');
const session = require('cookie-session');
const passport = require('passport');
const mainPageRouter = require('./routes/mainPage')
require('dotenv').config();
const path = require('path');
const app = express();
require('./configure/passport');

/*PreConfigure*/
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Nikitochka',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.session());
/*Route(s)*/
app.use(mainPageRouter)

/*Error middleware*/

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).render('errPage', {errMsg: err.message})
})

/*Configure too*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 8000
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));