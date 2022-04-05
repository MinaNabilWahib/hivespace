const { validationResult } = require('express-validator')

exports.handleErrors = (req, res, next) => {
  let errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    let error = new Error()
    error.status = 422
    error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
    throw error
  }
  next()
} //handle express validator error

exports.generateError = (status, message) => {
  let error = new Error()
  error.status = status
  error.message = message
  throw error
} //generate new error
