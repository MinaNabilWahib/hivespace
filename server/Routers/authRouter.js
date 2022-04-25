const express = require('express')
const passport = require('../Service/passport')
const {
  register_post,
  sendVerificationEmail,
  emailVerify,
  login_post,
  sendResetPassword,
  passVerify,
  sendWelcomeMail,
  generateToken,
  me_get,
  sendWelcomeMailSocial,
} = require('../Controllers/authController')
const { registerValidation, loginValidation } = require('../Service/authValidation')
const { emailValidation } = require('../Service/authValidation')
const { handleErrors } = require('../Utils/handleErrors.utils')
const { validateToken } = require('../Middleware/permissions')
const router = express.Router()

//register route
router.post('/register', registerValidation, handleErrors, register_post, sendVerificationEmail)

// login route
router.post('/login', loginValidation, handleErrors, login_post, sendWelcomeMail)

//test google auth
router.get('/', (req, res) => {
  res.send(
    '<a href="/auth/google">Authenticate with google</a><br> <a href="/auth/facebook">Authenticate with facebook</a>',
  )
})

// google auth
router.get(
  '/auth/google',
  passport.init().authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/user.phonenumbers.read',
      'https://www.googleapis.com/auth/user.addresses.read',
      'https://www.googleapis.com/auth/profile.agerange.read',
      'https://www.googleapis.com/auth/user.birthday.read',
      'https://www.googleapis.com/auth/user.gender.read',
    ],
  }),
)

//google auth callback
router.get(
  '/auth/google/callback',
  passport.init().authenticate('google', {
    failureRedirect: 'http://localhost:3000/auth/failure',
    session: false,
  }),
  generateToken,
  sendWelcomeMailSocial,
)

// facebook auth
router.get(
  '/auth/facebook',
  passport.init().authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/auth/failure',
    scope: [
      'email',
      'public_profile',
      'user_location',
      'user_gender',
      'user_link',
      'user_birthday',
      'user_age_range',
      'user_hometown',
    ],
  }),
)

//facebook auth callback
router.get(
  '/auth/facebook/callback',
  passport.init().authenticate('facebook', {
    session: false,
  }),
  generateToken,
  sendWelcomeMailSocial,
)

//re send E-mail verify
router.post('/verifyEmail', emailValidation, handleErrors, sendVerificationEmail)

// E-mail verify
router.get('/user/verify/:id/:token', emailVerify)

// send mail for reset password
router.post('/password/reset', emailValidation, handleErrors, sendResetPassword)

//reset your password
router.post('/password/reset/:id/:token', passVerify)

//get user data
router.get('/me', validateToken, me_get)

module.exports = router
