const express = require('express')
const UserRouter = express.Router()
const controller = require('../Controllers/userController.js')
const { validateToken, validateID } = require('../Middleware/permissions.js')

UserRouter.route('/user')
  .get(controller.getUser)
  .delete(controller.deleteUser)
  .post((request, response, next) => {
    try {
      response.redirect(307, '/register')
    } catch (error) {
      next(error)
    }
  })
UserRouter.put('/user/:id', validateID, validateToken, controller.updateUser)
UserRouter.put('/password/change', validateToken, controller.changePassword)
module.exports = UserRouter
