const express = require('express');
const { register_post } = require('../Controller/authController');
const { registerValidation } = require('../Service/authValidation');
const { handleErrors } = require('../Utils/handleErrors.utils');
const router = express.Router();


router.post('/register', registerValidation, handleErrors, register_post);
router.get('/me', (req, res) => {

    res.status(200).json({ data: "dsadfsdf" });
})

module.exports = router;