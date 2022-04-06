const { validationResult } = require('express-validator')
const workspace = require('../Models/WorkspaceSchema')

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

exports.addWorkSpace = (request, response, next) => {
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
    date_created: new Date(),
  })

  object
    .save()
    .then(data => {
      response.status(200).json({ message: 'workspace has successfully added', data: data })
    })
    .catch(err => {
      next(err)
    })
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
  workspace
    .deleteOne({ _id: request.body.id })
    .then(data => {
      if (data.matchedCount == 0) throw new Error("workspace isn't fount")
      else response.status(201).json({ message: 'workspace has successfully deleted' })
    })
    .catch(err => {
      next(err)
    })
}
