const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { validateCountryPhone } = require('../Service/userDataValidation')

const userSchema = new mongoose.Schema({
  socialId: {
    facebook: String,
    google: String
  },
  first_name: {
    type: String,
    trim: true,
    required: true,
    match: [/^[A-Za-z]+$/, 'firstName must be string'],
    minLength: [3, 'Minimum length is 3 characters'],
    maxLength: [20, 'Maximum Length is 20 characters'],
  },
  last_name: {
    type: String,
    trim: true,
    required: true,
    match: [/^[A-Za-z]+$/, 'lastName must be string'],
    minLength: [3, 'Minimum length is 3 characters'],
    maxLength: [20, 'Maximum Length is 20 characters'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Your E-Mail is Required !!'],
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Email Syntax is wrong'],
  },
  password_hash: {
    type: String,
  },
  phone_number: String,
  country: String,
  verified: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: 'Add your Bio',
    trim: true,
    minLength: [7, 'Minimum length is 7 characters'],
    maxLength: [50, 'Maximum Length is 50 characters'],
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  workspaces: {
    type: [mongoose.Types.ObjectId],
    ref: 'Workspace',
  },
  userInfo: {
    googleInfo: Object,
    facebookInfo: Object
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
})

//virtual full name [get,set]
userSchema
  .virtual('fullName')
  .get(function () {
    return this.first_name + ' ' + this.last_name
  })
  .set(function (value) {
    this.first_name = value.substr(0, value.indexOf(' '))
    this.last_name = value.substr(value.indexOf(' ') + 1)
  })

//If change password
userSchema
  .virtual('changePassword')
  .get(function () {
    return this._changePassword
  })
  .set(function (value) {
    this._changePassword = value
  })

//virtual password
userSchema
  .virtual('password')
  .get(function () {
    return this._password
  })
  .set(function (value) {
    this._password = value
  })

//virtual password confirm
userSchema
  .virtual('passwordConfirm')
  .get(function () {
    return this._passwordConfirm
  })
  .set(function (value) {
    this._passwordConfirm = value
  })

//validate password
const handlePassErrors = (password, passwordConfirm) => {
  if (password && passwordConfirm) {
    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)) {
      throw new Error(
        'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.',
      )
    }
    if (password !== passwordConfirm) {
      throw new Error("Two Passwords doesn't Match.")
    }
  } else {
    throw new Error('Two passwords fields required')
  }
}

// pre validate check country, phone number and valid password
userSchema.pre('validate', async function (next) {
  try {
    if (this.isNew)
      validateCountryPhone(this.country, this.phone_number)
    if (this._changePassword || this.isNew) {
      handlePassErrors(this._password, this._passwordConfirm)
      let salt = await bcrypt.genSalt(10)
      this.password_hash = await bcrypt.hash(this._password, salt)
    }
  } catch (error) {
    next(error)
  }
})


//compare password
userSchema.methods.comparePassword = async function (password) {
  const match = await bcrypt.compare(password, this.password_hash)
  if (!match) return false
  return true
}
//custom user data
userSchema.methods.userData = function () {
  return {
    _id: this._id,
    socialId: this.socialId,
    fullName: this.fullName,
    email: this.email,
    bio: this.bio,
    phone_number: this.phone_number,
    country: this.country,
    image: this.image,
    verified: this.verified,
    userInfo: this.userInfo,
    workspaces: this.workspaces,
    date_created: this.date_created,
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
