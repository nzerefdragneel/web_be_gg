const db = require("../models");
const config = require("../config/auth.config");

const User = db.user

const Op = db.Sequelize.Op

var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {
        res.status(201).send({
            message: 'User registered successfully!'
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}