 const fbpassport= require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
fbpassport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET_KEY,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        console.log(3)
        process.nextTick(function () {
            //Check whether the User exists or not using profile.id
            if (config.use_database) {
                //Further code of Database.
            }
            return done(null, profile);
        });
    }
))
export default fbpassport