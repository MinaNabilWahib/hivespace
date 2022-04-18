const express = require('express')
const listsRouter = express.Router()
const controller = require('../Controllers/listsController.js')
listsRouter.router
  .route('/create-list')

  .put(controller.createList)

///
listsRouter.router
  .route('/delete-list')

  .put(controller.deleteList)

module.exports = listsRouter
