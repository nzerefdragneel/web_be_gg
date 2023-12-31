const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const passport = require("passport");
var localStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

require("dotenv").config();
const mailer = require("../utils/mailer");
const { types } = require("pg");
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
        expiresIn: 360000, // 1 hour
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
};*/
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

//Using Passportjs
const signin = (req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        rememberMe: true,
    };

    if (!user.username) {
        return res.status(404).send({ message: "User Not found." });
    }

    if (!user.password) {
        return res.status(401).send({
            message: "Invalid Password!",
        });
    }
    return passport.authenticate(
        "signin",
        { session: false },
        (err, passportUser, info) => {
            if (err) {
                // return res.status(500).send({ message: err.message });
                return next(err);
            }
            const password = req.body.password;
            const accessToken = jwt.sign({ password }, config.secret, {
                expiresIn: 360000, // 1 hour
            });
            if (passportUser) {
                return res.status(200).send({
                    id: passportUser.id,
                    username: passportUser.username,
                    email: passportUser.email,
                    accessToken: accessToken,
                    exp: 360000,
                });
            }
            return res.status(400).send({ message: info.errors });
        }
    )(req, res, next);
};

passport.use(
    "signin",
    new localStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            User.findOne({
                where: {
                    username: req.body.username,
                },
            })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            errors: "Username or password",
                        });
                    }
                    if (user.active === false) {
                        return done(null, false, {
                            errors: "Your account has been blocked!",
                        });
                    }
                    const passwordIsValid = bcrypt.compareSync(
                        req.body.password,
                        user.password
                    );
                    if (!passwordIsValid) {
                        return done(null, false, {
                            errors: "Username or password",
                        });
                    }
                    if (
                        !user.verified ||
                        user.verified === false ||
                        user.verified === null
                    ) {
                        return done(null, false, {
                            errors: "Please verify your email first!",
                        });
                    }
                    if (true) {
                        req.session.cookie.maxAge = 60 * 60 * 1000; // Cookie expires after 1 hour
                    } else {
                        req.session.cookie.expires = false; // Cookie expires at end of session
                    }

                    return done(null, user);
                })
                .catch(done);
        }
    )
);

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                //Check whether the User exists or not using profile.id
                if (config.use_database) {
                    //Further code of Database.
                }
                return done(null, profile);
            });
        }
    )
);

const googleSignin = passport.authenticate("google", {
    scope: ["profile", "email"],
});

const googleSigninCallback = (req, res, next) => {
    passport.authenticate(
        "google",
        { session: false },
        (err, profile, info) => {
            if (err) {
                return next(err);
            }
            if (profile) {
                const json = profile._json;

                User.findOne({
                    where: {
                        email: json.email,
                        type: "google",
                    },
                }).then((user) => {
                    if (user) {
                        const accessToken = jwt.sign({ user }, config.secret, {
                            expiresIn: 3600, // 1 hour
                        });
                        return res
                            .status(302)
                            .redirect(
                                `${process.env.APP_URL}?accessToken=${accessToken}&haveAccount=true`
                            );
                    }

                    //Thêm user vào database
                    User.create({
                        username: json.name,
                        email: json.email,
                        type: "google",
                        // password: bcrypt.hashSync(req.body.password, 8),
                        createdat: Date.now().toString(),
                    })
                        .then((user) => {
                            const accessToken = jwt.sign(
                                { user },
                                config.secret,
                                {
                                    expiresIn: 3600, // 1 hour
                                }
                            );
                            return res
                                .status(302)
                                .redirect(
                                    `${process.env.APP_URL}?accessToken=${accessToken}&haveAccount=true`
                                );
                        })
                        .catch((err) => {
                            res.status(400).send({
                                message: err.message,
                            });
                        });
                });
            }
            return res.status(400).info;
        }
    )(req, res, next);
};

passport.use(
    "facebook",
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_SECRET_KEY,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                //Check whether the User exists or not using profile.id
                if (config.use_database) {
                    //Further code of Database.
                }
                return done(null, profile);
            });
        }
    )
);

const facebookSignin = passport.authenticate("facebook");

const facebookSigninCallback = (req, res, next) => {
    passport.authenticate(
        "facebook",
        { session: false },
        (err, profile, info) => {
            if (err) {
                return next(err);
            }
            if (profile) {
                const json = profile._json;

                User.findOne({
                    where: {
                        fbID: json.id,
                        type: "facebook",
                    },
                }).then((user) => {
                    if (user) {
                        const accessToken = jwt.sign({ user }, config.secret, {
                            expiresIn: 3600, // 1 hour
                        });
                        console.log(true);
                        return res
                            .status(302)
                            .redirect(
                                `${process.env.APP_URL}?accessToken=${accessToken}&haveAccount=true`
                            );
                    }

                    //Thêm user vào database
                    User.create({
                        username: json.name,
                        fbID: json.id,
                        type: "facebook",
                        // password: bcrypt.hashSync(req.body.password, 8),
                        createdat: Date.now().toString(),
                    })
                        .then((user) => {
                            const accessToken = jwt.sign(
                                { user },
                                config.secret,
                                {
                                    expiresIn: 3600, // 1 hour
                                }
                            );
                            console.log(false);
                            return res
                                .status(302)
                                .redirect(
                                    `${process.env.APP_URL}?accessToken=${accessToken}&haveAccount=true`
                                );
                        })
                        .catch((err) => {
                            res.status(400).send({
                                message: err.message,
                            });
                        });
                });
            }
            return res.status(400).info;
        }
    )(req, res, next);
};

module.exports = {
    signin,
    signup,
    googleSignin,
    googleSigninCallback,
    facebookSignin,
    facebookSigninCallback,
    verify,
};
