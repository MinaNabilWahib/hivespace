const express = require('express')
const dailyChatRouter = express.Router()
const controller = require('../Controllers/dailyChatController')

dailyChatRouter
  .route('/dailyChat')
  .get(controller.getDailyChat)
  .delete(controller.deletDailyChat)
  .put(controller.createMessage)
  .post(controller.createDailyChat)

module.exports = dailyChatRouter
