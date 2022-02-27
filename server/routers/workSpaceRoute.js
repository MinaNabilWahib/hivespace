const express = require('express')
const router = express.Router()
const { body, param, query } = require('express-validator')
const controller = require('../controllers/workSpaceController')

router
  .route('/workspace')
  .get(controller.getWorkSpace)
  .post(
    [
      body('title').isString().withMessage('workspace title must be string'),
      body('description').isString().withMessage('workspace description must be a string'),
      body('members').isArray().withMessage('workspace members must be an array'),
    ],
    controller.addWorkSpace,
  )
  .put(
    [
      body('title').isString().withMessage('workspace name must be string'),
      body('description').isString().withMessage('workspace description must be a string'),
      body('members').isArray().withMessage('workspace members must be an array'),
    ],
    controller.updateWorkSpace,
  )
  .delete(controller.deleteWorkSpace)

module.exports = router
