const { body } = require('express-validator')
const User = require('../Models/UserSchema')
const { validateCountryPhone } = require('./userDataValidation')

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email required')
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
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password can not be empty!!')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    .withMessage(
      'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.',
    ),
] // login validation

exports.registerValidation = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name can not be empty!!')
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters required for userName!')
    .isLength({ max: 20 })
    .withMessage('Maximum 20 characters required for userName!')
    .isAlpha()
    .withMessage('full name should be string'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name can not be empty!!')
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters required for userName!')
    .isLength({ max: 20 })
    .withMessage('Maximum 20 characters required for userName!')
    .isAlpha()
    .withMessage('Last name should be string'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Invalid email address!')
    .isEmail()
    .withMessage('Invalid email address!')
    .custom(async (value, { req }) => {
      const { email } = req.body
      const user = await User.findOne({ email })
      if (user) {
        throw new Error('email is already exists')
      }
      return true
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password can not be empty!!')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    .withMessage(
      'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.',
    ),
  body('passwordConfirm')
    .trim()
    .notEmpty()
    .withMessage('passwordConfirm can not be empty!!')
    .custom((value, { req }) => {
      const { password } = req.body
      if (password !== value) {
        throw new Error("Two Passwords doesn't Match.")
      }
      return true
    }),
  body('country', 'phone_number')
    .trim()
    .custom((value, { req }) => {
      const { country, phone_number } = req.body
      if (!country && !phone_number) return true
      req.phoneNumber = validateCountryPhone(country, phone_number)
      return true
    }),
] //registration validation
