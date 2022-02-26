const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
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
  phone_number: Number,
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
  workspaces: {
    type: [mongoose.Types.ObjectId],
    ref: 'Workspace',
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
