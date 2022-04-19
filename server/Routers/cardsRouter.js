const express = require('express')
const cardsRouter = express.Router()
const controller = require('../Controllers/cardsController.js')
const { validateToken } = require('../Middleware/permissions')
const { body } = require('express-validator')
cardsRouter
  .route('/create-card')

  .put(
    [
      body('title').isString().notEmpty().isLength({ max: 20 }).withMessage('must enter a title'),
      body('description').isString().isLength({ max: 200 }).notEmpty(),
      body('creator').notEmpty(),
      body('assigned_to').notEmpty().withMessage('must assign to someone'),
      body('due_date').notEmpty().withMessage('must add a due date'),
    ],
    validateToken,
    controller.createCard,
  )

///
cardsRouter
  .route('/delete-card')

  .delete(validateToken, controller.deleteCard)

module.exports = cardsRouter
