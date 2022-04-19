const express = require('express')
const listsRouter = express.Router()
const controller = require('../Controllers/listsController.js')
listsRouter
  .route('/create-list')

  .put(controller.createList)

///
listsRouter
  .route('/delete-list')

  .delete(controller.deleteList)

module.exports = listsRouter
