const express = require('express')
const {
  register_post,
  sendVerificationEmail,
  emailVerify,
  login_post,
  sendResetPassword,
  passVerify,
} = require('../Controllers/authController')
const { registerValidation, loginValidation } = require('../Service/authValidation')
const { emailValidation } = require('../Service/userDataValidation')
const { handleErrors } = require('../Utils/handleErrors.utils')
const router = express.Router()

//register route
router.post('/register', registerValidation, handleErrors, register_post, sendVerificationEmail)

// login route
router.post('/login', loginValidation, handleErrors, login_post)

//re send E-mail verify
router.post('/verifyEmail', emailValidation, handleErrors, sendVerificationEmail)

// E-mail verify
router.get('/user/verify/:id/:token', emailVerify)

// send mail for reset password
router.post('/password/reset', emailValidation, handleErrors, sendResetPassword)

//reset your password
router.post('/password/reset/:id/:token', passVerify)

router.get('/me', (req, res) => {
  res.status(200).json({ data: 'dsadfsdf' })
})

module.exports = router
