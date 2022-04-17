const { validationResult } = require('express-validator')
const workspace = require('../Models/WorkspaceSchema')
const user = require('../Models/UserSchema')

exports.getWorkSpace = (request, response, next) => {
  workspace
    .find()
    .then(data => {
      response.status(200).json({ message: 'Your WorkSpaces', data: data })
    })
    .catch(err => {
      next(err)
    })
}

exports.createWorkspace = (request, response, next) => {
  let errors = validationResult(request)
  if (!errors.isEmpty()) {
    let error = new Error()
    error.status = 422
    error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
    throw error
  }

  let object = new workspace({
    title: request.body.title,
    description: request.body.description,
    members: request.body.members,
    owner: request.body.owner,
    date_created: new Date(),
  })

  object
    .save()
    .then(data => {
      user.updateOne({ _id: request.body.owner }, { $push: { workspaces: data._id } }).then(() => {
        response.status(200).json({ message: 'workspace has successfully added', data: data })
      })
    })
    .catch(err => {
      next(err)
    })
}

exports.addWorkspaceMember = async (req, res, next) => {
  try {
    const myWorkspace = await user.updateOne({ _id: req.body.user }, { $push: { workspaces: req.body.workspace } })
    const member = await workspace.updateOne({ _id: req.body.workspace }, { $push: { members: req.body.user } })

    res.json({ myWorkspace, member })
  } catch (error) {
    next(error)
  }
}

exports.deleteWorkspaceMember = async (req, res, next) => {
  try {
    const myWorkspace = await user.updateOne({ _id: req.body.user }, { $pull: { workspaces: req.body.workspace } })
    const member = await workspace.updateOne({ _id: req.body.workspace }, { $pull: { members: req.body.user } })

    res.json({ myWorkspace, member })
  } catch (error) {
    next(error)
  }
}

exports.updateWorkSpace = (request, response, next) => {
  let errors = validationResult(request)
  if (!errors.isEmpty()) {
    let error = new Error()
    error.status = 422
    error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
    throw error
  }
  workspace
    .updateOne(
      { _id: request.body.id },
      {
        $set: {
          title: request.body.title,
          description: request.body.description,
          owner: request.body.owner,
          members: request.body.members,
        },
      },
    )
    .then(data => {
      if (data.matchedCount == 0) throw new Error("workspace isn't found")
      else response.status(201).json({ message: 'workspace has successfully updated', data: data })
    })
    .catch(err => {
      next(err)
    })
}

exports.deleteWorkSpace = (request, response, next) => {
  workspace.deleteOne({ _id: request.body.workspace }).then(data => {
    if (data.matchedCount == 0) throw new Error("workspace isn't fount")
    else response.status(201).json({ message: 'workspace has successfully deleted' })
  })
  user
    .updateMany({ workspaces: request.body.workspace }, { $pull: { workspaces: request.body.workspace } })
    .then()
    .catch(err => {
      next(err)
    })
}
