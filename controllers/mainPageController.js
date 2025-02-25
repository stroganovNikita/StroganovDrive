const { validationResult } = require('express-validator');
const { signUpValidator } = require('./validator');

exports.signUpQuery =  [
    signUpValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).render("signUp", {
            title: "Create user",
            errors: errors.array()
          })
        } 
    }
]