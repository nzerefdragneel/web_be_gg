const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const passport = require("passport");
var localStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        //Check whether the User exists or not using profile.id
        if (config.use_database) {
            //Further code of Database.
        }
        return done(null, profile);
    });
  }
));

const googleSignin = passport.authenticate('google', { scope : ['profile', 'email'] })

const googleSigninCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, profile, info) => {
        if (err) {
            return next(err)
        }
        console.log(profile)
        if (profile) {
            // return res.status(200).send({
            //     profile: profile
            // });
            return  res.status(302).redirect('http://localhost:8081/home');
        }
        return res.status(400).info;
    })(req, res, next);
}

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET_KEY,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
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
))

const facebookSignin =  passport.authenticate('facebook')
// const facebookSignin = passport.authenticate('facebook', { session: false }, (err, profile, info) => {
//     if (err) {
//         return next(err)
//     }
//     if (profile) {
//         console.log(profile)
//         res.status(200).send({
//             profile: profile
//         });
//         response.writeHead(302, {
//             'Location': 'http://localhost:8081/home'
//             //add other headers here...
//           });
//           response.end();
//         return;
//     }
//     return res.status(400).info;
// })

const facebookSigninCallback = (req, res, next) => {
    passport.authenticate('facebook', { session: false }, (err, profile, info) => {
        if (err) {
            return next(err)
        }
        if (profile) {
            console.log(profile)
            // res.status(200).send({
            //     profile: profile
            // });
            // // return res.redirect(302, "http://localhost:8081/home");            
            return  res.status(302).redirect('http://localhost:8081/home');
        }
        return res.status(400).info;
    })(req, res, next);
}

module.exports = {
    signin,
    signup,
    googleSignin,
    googleSigninCallback,
    facebookSignin,
    facebookSigninCallback
};
