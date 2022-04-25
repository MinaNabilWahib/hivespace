const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const controller = require('../Controllers/workSpaceController')
const { validateToken } = require('../Middleware/permissions')

router
  .route('/createWorkspace/:id')
  .get(validateToken, controller.getWorkSpace)
  .delete(validateToken, controller.deleteWorkSpace)

router
  .route('/createWorkspace')

  .post(
    [
      body('title').isString().withMessage('workspace title must be string'),
      body('description').isString().withMessage('workspace description must be a string'),
      body('members').isArray().withMessage('workspace members must be an array'),
      body('owner').notEmpty().withMessage('workspace must have an owner'),
    ],
    validateToken,
    controller.createWorkspace,
  )
  .put(
    [
      body('title').isString().withMessage('workspace name must be string'),
      body('description').isString().withMessage('workspace description must be a string'),
      body('members').isArray().withMessage('workspace members must be an array'),
      body('owner').notEmpty().withMessage('workspace must have an owner'),
    ],
    validateToken,
    controller.updateWorkSpace,
  )

router
  .route('/updateWorkspaceMembers')
  .put(validateToken, controller.addWorkspaceMember)
  .delete(validateToken, controller.deleteWorkspaceMember)

module.exports = router
