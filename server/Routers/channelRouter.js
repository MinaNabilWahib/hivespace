const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const controller = require('../Controllers/channelController')

router
  .route('/channel')
  .get(controller.getchannel)
  .post(
    [
      body('title').isString().withMessage('Channel title must be string'),
      body('description').isString().withMessage('Channel description must be a string'),
      body('members').isArray().withMessage('Channel members must be an array'),
    ],
    controller.addchannel,
  )
  .put(
    [
      body('title').isString().withMessage('Channel name must be string'),
      body('description').isString().withMessage('Channel description must be a string'),
      body('members').isArray().withMessage('Channel members must be an array'),
    ],
    controller.updatechannel,
  )
  .delete(controller.deletechannel)

module.exports = router
