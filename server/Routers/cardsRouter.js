const express = require('express')
const cardsRouter = express.Router()
const controller = require('../Controllers/cardsController.js')
const { validateToken } = require('../Middleware/permissions')
cardsRouter
  .route('/create-card')

  .put(validateToken, controller.createCard)

///
cardsRouter
  .route('/delete-card')

  .delete(validateToken, controller.deleteCard)

module.exports = cardsRouter
