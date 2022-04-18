const express = require('express')
const cardsRouter = express.Router()
const controller = require('../Controllers/cardsController.js')
cardsRouter
  .route('/create-card')

  .put(controller.createCard)

///
cardsRouter
  .route('/delete-card')

  .put(controller.deleteCard)

module.exports = cardsRouter
