const express = require('express')
const commentRouter = express.Router()
const controller = require('../Controllers/commentsController.js')
const { validateToken } = require('../Middleware/permissions')
const { body } = require('express-validator')
commentRouter
  .route('/create-comment')

  .put(
    [body('content').isString().isLength({ max: 200 }).notEmpty(), body('sender').notEmpty],
    validateToken,
    controller.createComment,
  )

///
commentRouter
  .route('/delete-comment')

  .delete(validateToken, controller.deleteComment)

module.exports = commentRouter
