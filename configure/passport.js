const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const customFields = {
    usernameField: 'nickName',
    passwordField: 'password'
};

const StrategyFn = async (username, password, done) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                nickName: username
            }
        });
        const user = users[0];
        if (!user) {
            return done(null, false, {message: "Such username not found!"})
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return done(null, false, {message: "Password not correct!"})
        }
        return done(null, user);
    } catch(err) {
        return done(err)
    }
};

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findMany({
            where: {
                id: id
            }
        });
        done(null, user[0]);
    } catch(err) {
        done(err);
    }
});

const customStrategy = new LocalStrategy(customFields, StrategyFn);

passport.use(customStrategy);