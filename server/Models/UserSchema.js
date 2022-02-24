const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  firstName: {
    type: String,
    trim: true,
    required: true,
    match: [/^[A-Za-z]+$/, 'firstName must be string'],
    minLength: [3, 'Minimum length is 3 characters'],
    maxLength: [20, 'Maximum Length is 20 characters'],
  },
  lastName: {
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
  passwordHash: {
    type: String,
  },
  phoneNumber: Number,
  country: String,
  verified: {
    type: Boolean,
    default: false,
  },
  image: String,
  bio: {
    type: String,
    trim: true,
    minLength: [7, 'Minimum length is 7 characters'],
    maxLength: [50, 'Maximum Length is 50 characters'],
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
  },
  workSpace: {
    type: mongoose.Types.ObjectId,
    ref: 'Workspace',
  },
  date_Created: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
