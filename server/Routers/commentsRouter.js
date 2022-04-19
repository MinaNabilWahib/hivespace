const express = require('express')
const commentRouter = express.Router()
const controller = require('../Controllers/commentsController.js')
const { validateToken } = require('../Middleware/permissions')
commentRouter
  .route('/create-comment')

  .put(validateToken, controller.createComment)

///
commentRouter
  .route('/delete-comment')

  .delete(validateToken, controller.deleteComment)

module.exports = commentRouter
