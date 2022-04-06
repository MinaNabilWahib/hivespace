const express = require('express')
const UserRouter = express.Router()
const controller = require('../Controllers/userController.js')

UserRouter.route('/user')
  .get(controller.getUser)
  .delete(controller.deleteUser)
  .put()
  .post((request, response, next) => {
    try {
      response.redirect(307, '/register')
    } catch (error) {
      next(error)
    }
  })

module.exports = UserRouter
