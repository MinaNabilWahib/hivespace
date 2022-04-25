const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
var countries = require('i18n-iso-countries')
const { AsYouType } = require('libphonenumber-js/min')
// const request = require("request");
const User = require('../Models/UserSchema')

//config google keys
const configGoogle = {
  CLIENT_ID: process.env.googleCLIENT_ID,
  CLIENT_SECRET: process.env.googleCLIENT_SECRET,
}

//google auth options
exports.AUTH_OPTIONS_GOOGLE = {
  callbackURL: '/auth/google/callback',
  clientID: configGoogle.CLIENT_ID,
  clientSecret: configGoogle.CLIENT_SECRET,
}
const requestMoreDataGoogle = async accessToken => {
  try {
    const body = await fetch(
      `https://people.googleapis.com/v1/people/me?personFields=phoneNumbers,addresses,genders,birthdays`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        method: 'GET',
      },
    ).then(res => res.json())
    return body
  } catch (error) {
    console.log(error)
  }
}

const getCountryFromNumber = number => {
  const asYouType = new AsYouType()
  asYouType.input(number)
  let codeCountry = asYouType.getNumber().country
  let country = countries.getName(codeCountry, 'en')
  return country
}
// const requestMoreDataGoogle = async (accessToken) => {
//      request.get({
//         url: `https://people.googleapis.com/v1/people/me?personFields=phoneNumbers,addresses,genders,birthdays`,
//         headers: {
//             'Authorization': 'Bearer ' + accessToken
//         },
//         method: 'GET'
//     }, function (err, response, body) {
//         // console.log(JSON.parse(body).birthdays[0].date, response.Person);
//         if (err) return null;
//         // profile.phoneNumber = (JSON.parse(body)?.phoneNumbers) ? JSON.parse(body).phoneNumbers[0].canonicalForm : null;
//         // profile.address = (JSON.parse(body)?.addresses) ? JSON.parse(body).addresses[0].formattedValue : null;
//         // profile.gender = JSON.parse(body)?.genders[0].formattedValue || null;
//         // profile.birthDay = JSON.parse(body)?.birthdays[0].date || null;
//         console.log(JSON.parse(body));
//         return JSON.parse(body);
//     });
// }

exports.verifyCallBackGoogle = async (accessToken, refreshToken, profile, done) => {
  /* //todo :
        find email if exist 
            >> find google id if exist return user
            >> if not exist update google id and userInfoGoogle
        if email not exist return new user */
  try {
    let user = await User.findOne({ email: profile.emails[0].value })
    if (user) {
      if (user.socialId.google) {
        return done(null, { ...user.userData(), firstRegistration: false })
      } else {
        const googleInfo = await requestMoreDataGoogle(accessToken)
        let country = ''
        let phone_number = ''
        if (googleInfo.phoneNumbers && googleInfo.phoneNumbers.length) {
          phone_number = googleInfo.phoneNumbers[0].canonicalForm
          country = getCountryFromNumber(phone_number)
        }
        Object.assign(
          user,
          profile.id && { socialId: { ...user.socialId, google: profile['id'] } },
          profile._json && { userInfo: { ...user.userInfo, googleInfo } },
          profile.photos && profile.photos.length && user.image == '' && { image: profile.photos[0].value },
          phone_number && !user.phone_number && { phone_number },
          country && !user.country && { country },
          { verified: true },
        )
        user.save({ validateBeforeSave: false })
        return done(null, { ...user.userData(), firstRegistration: false })
      }
    } else {
      const googleInfo = await requestMoreDataGoogle(accessToken)
      let country = ''
      let phone_number = ''
      if (googleInfo.phoneNumbers) {
        phone_number = googleInfo.phoneNumbers[0].canonicalForm
        country = getCountryFromNumber(phone_number)
      }
      user = new User({
        'socialId.google': profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        image: profile.photos[0].value || '',
        phone_number: phone_number || '',
        country: country || '',
        verified: true,
        'userInfo.googleInfo': { ...googleInfo },
      })
      user.save({ validateBeforeSave: false })
      return done(null, { ...user.userData(), firstRegistration: true })
    }
  } catch (error) {
    done(error)
  }
}
