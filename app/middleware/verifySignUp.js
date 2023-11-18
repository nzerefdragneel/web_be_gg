const db = require("../models");

const User = db.user

checkDuplicateUsernameOrEmail = (req, res, next) => {
    //Username
    console.log(req.body)
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then((user) => {
        if (user) {
            res.status(400).send({
                message: 'Falied! Username is already in use!'
            })
            return;
        }

        //Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then((user) => {
            if (user) {
                res.status(400).send({
                    message: 'Falied! Email is already in use!'
                })
                return;
            }

            next();
        })
    }).catch(err =>{
        console.log(err)
        res.status(500).send({
            message: err
        })
    }
    );
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;