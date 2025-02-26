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
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        console.log("test")
        return user
    } catch {

    }
}

StrategyFn()