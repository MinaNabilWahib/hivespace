const User = require('../Models/UserSchema')

exports.register_post = async (req, res, next) => {
  try {
    //get data from body
    const { first_name, last_name, email, password, passwordConfirm, country } = req.body
    let user = {}
    user = User({
      first_name,
      last_name,
      email,
      password,
      passwordConfirm,
      country,
      phone_number: req.phoneNumber,
      image: '',
    })

    //save data
    await user.save()
    req.user = user
    res.status(200).json({ user })
    // next();
  } catch (error) {
    next(error)
  }
} //registration for speakers
