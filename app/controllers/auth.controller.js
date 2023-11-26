const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const passport = require("passport");
var localStrategy = require('passport-local').Strategy;

const signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        createdat: Date.now().toString(),
        updatedat: Date.now().toString()
    }).then(user => {
        res.status(201).send({
            message: 'User registered successfully!'
        })
    }).catch(err => {
        res.status(400).send({
            message: err.message
        })
    })
}

//Using JWT
/*
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
*/

//Using Passportjs
const signin = (req, res, next) => {

    const user = {
        username: req.body.username,
        password: req.body.password,
        rememberMe: req.body.rememberMe,
    }

    if (!user.username) {
        return res.status(404).send({ message: "User Not found." });
    }

    if (!user.password) {
        return res.status(401).send({
            message: "Invalid Password!",
        });
    }

    return passport.authenticate('signin', { session: false }, (err, passportUser, info) => {
        if (err) {
            // return res.status(500).send({ message: err.message });
            return next(err)
        }
        if (passportUser) {
            return res.status(200).send({
                id: passportUser.id,
                username: passportUser.username,
                maxAge: req.session.cookie.maxAge,
            });
        }
        return res.status(400).info;
    })(req, res, next);
}

passport.use('signin', new localStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {

    User.findOne({
        where: {
            username: req.body.username,
        },
    })
        .then((user) => {
            if (!user) {
                return done(null, false, { errors: { 'Username or password': 'is invalid' } });
            }

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

            if (!passwordIsValid) {
                return done(null, false, { errors: { 'Username or password': 'is invalid' } });
            }

            if (req.body.rememberMe) {
                console.log('remember')
                req.session.cookie.maxAge = 60 * 60 * 1000; // Cookie expires after 1 hour
            } else {
                console.log('no remember')
                req.session.cookie.expires = false; // Cookie expires at end of session
            }

            return done(null, user);
        })
        .catch(done);
}
))


module.exports = {
    signin,
    signup,
};
