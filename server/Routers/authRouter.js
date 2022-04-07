const express = require('express')
const { register_post, sendVerificationEmail, emailVerify } = require('../Controllers/authController')
const { registerValidation } = require('../Service/authValidation')
const { emailValidation } = require('../Service/userDataValidation')
const { handleErrors } = require('../Utils/handleErrors.utils')
const router = express.Router()

//register route 
router.post('/register', registerValidation, handleErrors, register_post, sendVerificationEmail);

//re send E-mail verify
router.post("/verifyEmail", emailValidation, handleErrors, sendVerificationEmail);

// E-mail verify
router.get("/user/verify/:id/:token", emailVerify);

router.get('/me', (req, res) => {
  res.status(200).json({ data: 'dsadfsdf' })
})

module.exports = router
