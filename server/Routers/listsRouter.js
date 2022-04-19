const express = require('express')
const listsRouter = express.Router()
const controller = require('../Controllers/listsController.js')
const { validateToken } = require('../Middleware/permissions')
listsRouter
  .route('/create-list')

  .put(validateToken, controller.createList)

///
listsRouter
  .route('/delete-list')

  .delete(validateToken, controller.deleteList)

module.exports = listsRouter
