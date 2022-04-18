const express = require('express')
const cardsRouter = express.Router()
const controller = require('../Controllers/cardsController.js')
cardsRouter.router
  .route('/create-card')

  .put(controller.createCard)

///
cardsRouter.router
  .route('/delete-card')

  .put(controller.deleteCard)

module.exports = cardsRouter
