const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

require("dotenv").config();
const mailer = require("../utils/mailer");

const forgotPassword = (req, res) => {
    const email = req.body.email;

    User.findOne({
        where: {
            email: email,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "Email Not Found." });
            }

            let emailToken = bcrypt.hashSync(email, 10);
            mailer
                .sendMail(
                    user.email,
                    "Reset your password",
                    `<h1>Hi ${user.username}</h1><p>Click <a href="${process.env.APP_URL}/reset-password/${emailToken}">here</a> to reset your password.</p>`
                )
                .then(() => {
                    res.status(200).send({
                        message: "Please check your mailbox to reset your password.",
                    });
                });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

const resetPassword = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const token = req.body.token;

    if (!email || !password || !token) {
        return res.status(400).send({
            message: "Email, password or token not found",
        });
    } else {
        const emailIsValid = bcrypt.compareSync(email, token);

        if (!emailIsValid) {
            return res.status(401).send({
                message: "Wrong email validation",
            });
        }

        User.findOne({
            where: {
                email: email,
            },
        })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: "Email Not Found.",
                    });
                }

                user.password = bcrypt.hashSync(password, 8);
                user.save();

                res.status(200).send({
                    message: "Password changed successfully",
                });
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
}