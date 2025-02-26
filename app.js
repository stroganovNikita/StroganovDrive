/*Imports*/
const express = require('express');
const session = require('cookie-session');
const passport = require('passport');
const mainPageRouter = require('./routes/mainPage')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const CustomError = require('./errors/customError');
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
    store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdFunction: true,
            dbRecordIdIsSessionId: undefined,
        }
    )
}));
app.use(passport.session());
/*Route(s)*/
app.use(mainPageRouter);


/*Configure too*/
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + '/public')));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));
/*Error middleware*/
app.get("*", (req, res, next) => {
    next(new CustomError('Page not Found'))
});
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).render('errPage', {errMsg: err.message})
});
