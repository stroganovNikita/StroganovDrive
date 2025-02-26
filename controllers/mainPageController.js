const { validationResult } = require('express-validator');
const { signUpValidator } = require('./validator');
const db  = import('../db/queries.js');

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
        const test = await (await db).checkNickname(nickName)
        console.log(test)
        if (test.length > 0) {
          return res.status(400).render('signUp', {
            errors: [{msg: 'Nickname already exist!'}]
          })
        }
        (await db).signUpQueryDB(firstName, lastName, nickName, password);
        res.redirect('logIn')
      }
];

