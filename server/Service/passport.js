const passport = require('passport');
const { verifyCallBackFb, AUTH_OPTIONS_FB } = require('./facebookAuth');
const { AUTH_OPTIONS_GOOGLE, verifyCallBackGoogle } = require('./googleAuth');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

exports.init = () => {
    //google strategy
    passport.use(new GoogleStrategy(AUTH_OPTIONS_GOOGLE, verifyCallBackGoogle))

    //facebook strategy
    passport.use(new FacebookStrategy(AUTH_OPTIONS_FB, verifyCallBackFb))
    return passport;
}
