const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const controller = require('../Controllers/workSpaceController')

router
  .route('/createWorkspace')
  .get(controller.getWorkSpace)
  .post(
    [
      body('title').isString().withMessage('workspace title must be string'),
      body('description').isString().withMessage('workspace description must be a string'),
      body('members').isArray().withMessage('workspace members must be an array'),
      body('owner').notEmpty().withMessage('workspace must have an owner'),
    ],
    controller.createWorkspace,
  )
  .put(
    [
      body('title').isString().withMessage('workspace name must be string'),
      body('description').isString().withMessage('workspace description must be a string'),
      body('members').isArray().withMessage('workspace members must be an array'),
      body('owner').notEmpty().withMessage('workspace must have an owner'),
    ],
    controller.updateWorkSpace,
  )
  .delete(controller.deleteWorkSpace)

router.route('/updateWorkspaceMembers').put(controller.addWorkspaceMember).delete(controller.deleteWorkspaceMember)

module.exports = router
