const { body } = require('express-validator')
const User = require('../Models/UserSchema')
const countries = require('i18n-iso-countries')
const parsePhoneNumber = require('libphonenumber-js/mobile')
const { generateError } = require('../Utils/handleErrors.utils')

exports.validateCountryPhone = (country, phoneNumber) => {
  const countryCode = countries.getAlpha2Code(country, 'en')
  if (!countryCode) generateError(400, 'Invalid Country')
  if (isNaN(phoneNumber)) generateError(400, 'phone number must be only number type')
  const phone = parsePhoneNumber(phoneNumber, countryCode)
  if (!phone.isValid()) generateError(400, 'Invalid phone Number')
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
          generateError(400, "Invalid email");
        }
        req.user = user.userData()
        return true
      }),
  ]
} //email validation
