const express = require('express')
const listsRouter = express.Router()
const controller = require('../Controllers/listsController.js')
const { validateToken } = require('../Middleware/permissions')
const { body } = require('express-validator')
listsRouter
  .route('/create-list')

  .put(
    [body('title').isString().notEmpty().isLength({ max: 20 }).withMessage('must enter a title')],
    validateToken,
    controller.createList,
  )

///
listsRouter
  .route('/delete-list')

  .delete(validateToken, controller.deleteList)

module.exports = listsRouter
