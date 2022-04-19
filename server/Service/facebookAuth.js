const User = require("../Models/UserSchema");

//config facebook keys
const configFacebook = {
    CLIENT_ID: process.env.facebookCLIENT_ID,
    CLIENT_SECRET: process.env.facebookCLIENT_SECRET
}

//facebook auth options
exports.AUTH_OPTIONS_FB = {
    callbackURL: '/auth/facebook/callback',
    clientID: configFacebook.CLIENT_ID,
    clientSecret: configFacebook.CLIENT_SECRET,
    profileFields: ['id', 'email', 'link', 'displayName', 'name', 'address', 'gender', 'picture.type(large)', 'location', "birthday", 'age_range', 'hometown']
};

//verify call back facebook
exports.verifyCallBackFb = async (accessToken, refreshToken, profile, done) => {
    /* //todo :
        find email if exist 
            >> find facebook id if exist return user
            >> if not exist update facebook id and userInfoFb
        if email not exist return new user */
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            if (user.socialId.facebook) {
                return done(null, { ...user.userData(), firstRegistration: false });
            } else {
                Object.assign(user,
                    profile.id && { socialId: { ...user.socialId, facebook: profile['id'] } },
                    profile._json && { userInfo: { ...user.userInfo, facebookInfo: profile._json } },
                    profile.photos && user.image == '' && { image: profile.photos[0].value },
                    { verified: true }
                );
                user.save({ validateBeforeSave: false });
                return done(null, { ...user.userData(), firstRegistration: false })
            }
        } else {
            user = new User({
                'socialId.facebook': profile.id,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                image: profile.photos[0].value || '',
                verified: true,
                'userInfo.facebookInfo': { ...profile._json }
            })
            user.save({ validateBeforeSave: false });
            return done(null, { ...user.userData(), firstRegistration: true })
        }

    } catch (error) {
        done(error)
    }
}
