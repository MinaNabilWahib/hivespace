const jwt = require('jsonwebtoken')
const { generateError } = require('../Utils/handleErrors.utils')
const { ObjectId } = require('mongoose').Types

exports.validateToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) generateError(401, 'Invalid Token')
    const user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.secret_key)
    console.log(user)
    if (!user) generateError(401, 'token expired')
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
} //validate token

exports.validateID = (req, res, next) => {
  const { id } = req.params
  if (ObjectId.isValid(id)) {
    req.id = id
    next()
  } else {
    generateError(400, 'Invalid ID') // bad request
  }
} // validate ID
