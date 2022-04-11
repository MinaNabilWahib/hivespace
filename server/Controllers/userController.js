const User = require('../Models/UserSchema')
const { validateCountryPhone } = require('../Service/userDataValidation')
const { generateError } = require('../Utils/handleErrors.utils')
const { ObjectId } = require('mongoose').Types

// here is the get function
exports.getUser = (request, response, next) => {
  // console.log(request)
  const id = request.user._id
  User.findOne({ _id: id })
    .then(data => {
      response.status(200).json({ message: 'user is here', data: data })
    })
    .catch(error => {
      next(error)
    })
}

//here is the delete function
exports.deleteUser = (request, response, next) => {
  const id = request.user._id
  User.deleteOne({ _id: id })
    .then(data => {
      if (data == null) throw new Error('the user is not Found!')
      response.status(200).json({ message: 'deleted', data })
    })
    .catch(error => next(error))
}

//here is the update function
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.id })
    if (!user) generateError(403, 'User not found')
    const { first_name, last_name, bio, phone_number, country } = req.body
    const check = new ObjectId(user._id).equals(new ObjectId(req.user._id))
    if (!check) generateError(401, "can't update this user")
    if (phone_number || country) {
      validateCountryPhone(country, phone_number)
    }
    const updateItems = Object.assign(
      {},
      first_name && { first_name },
      last_name && { last_name },
      phone_number && { phone_number },
      country && { country },
      bio && { bio },
    )
    user = await User.findOneAndUpdate({ _id: req.user._id }, updateItems, { new: true, runValidators: true })
    res.status(200).json({ status: 'user updated', data: user.userData() })
  } catch (error) {
    next(error)
  }
}

//here is the change password function
exports.changePassword = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user._id })
    const { oldPassword, newPassword, confirmPassword } = req.body
    const comparePass = user?.password_hash ? await user.comparePassword(oldPassword) : 'pass'
    if (comparePass && newPassword && confirmPassword) {
      if (oldPassword == newPassword && comparePass != 'pass')
        generateError(403, ' please, change new password you enter old password again')
      user.changePassword = true
      user.password = newPassword
      user.passwordConfirm = confirmPassword
      await user.save()
      res.status(201).json({ status: 'password changed successfully' })
    } else {
      generateError(403, 'please , enter all inputs value')
    }
  } catch (error) {
    next(error)
  }
}
