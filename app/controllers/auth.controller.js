const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

require("dotenv").config();
const mailer = require("../utils/mailer");

const signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    createdat: Date.now().toString(),
  })
    .then((user) => {
      let emailToken = bcrypt.hashSync(req.body.email, 10);
      mailer
        .sendMail(
          user.email,
          "Verify your account",
          `<h1>Hi ${req.body.username}</h1><p>Click <a href="${process.env.SERVICE_URL}/api/auth/verify?email=${user.email}&token=${emailToken}">here</a> to verify your account.</p>`
        )
        .then(() => {
          res.status(201).send({
            message:
              "User registered successfully! Please check your email to verify your account.",
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message,
      });
    });
};

const signin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    where: {
      username: username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (!user.verified || user.verified === false) {
        return res.status(401).send({
          accessToken: null,
          message: "Please verify your account first!",
        });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const accessToken = jwt.sign({ password }, config.secret, {
        expiresIn: 30, // 1 hour
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        accessToken: accessToken,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const verify = (req, res) => {
  const email = req.query.email;
  const token = req.query.token;

  console.log(email, token);

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const emailIsValid = bcrypt.compareSync(email, token);

      if (!emailIsValid) {
        return res.status(401).send({
          message: "Wrong validation",
        });
      }

      user.verified = true;
      user.save()
        .then(() => {
          res.redirect(`${process.env.APP_URL}/login`);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


module.exports = {
  signin,
  signup,
  verify,
};
