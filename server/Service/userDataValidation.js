const { body } = require('express-validator')
const User = require('../Models/UserSchema')
const countries = require('i18n-iso-countries')
const parsePhoneNumber = require('libphonenumber-js/mobile')

exports.validateCountryPhone = (country, phoneNumber) => {
  const countryCode = countries.getAlpha2Code(country, 'en')
  if (!countryCode) throw new Error('Invalid Country')
  if (isNaN(phoneNumber)) throw new Error('phone number must be only number type')
  const phone = parsePhoneNumber(phoneNumber, countryCode)
  if (!phone.isValid()) throw new Error('Invalid phone Number')
  return phone.number
} // validate country and phone number

exports.emailValidation = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Invalid email address!')
      .isEmail()
      .withMessage('Invalid email address!')
      .custom(async (value, { req }) => {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
          throw new Error('Invalid email')
        }
        req.body.user = user
        return true
      }),
  ]
} //email validation
