const express = require('express')
const commentRouter = express.Router()
const controller = require('../Controllers/commentsController.js')
commentRouter
  .route('/create-comment')

  .put(controller.createComment)

///
commentRouter
  .route('/delete-comment')

  .delete(controller.deleteComment)

module.exports = commentRouter
