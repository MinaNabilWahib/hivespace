const { validationResult } = require('express-validator')
const channel = require('../Models/ChannelSchema')

exports.getchannel = (request, response, next) => {
  channel
    .find()
    .then(data => {
      response.status(200).json({ message: 'Your channels', data: data })
    })
    .catch(err => {
      next(err)
    })
}

exports.addchannel = (request, response, next) => {
  let errors = validationResult(request)
  if (!errors.isEmpty()) {
    let error = new Error()
    error.status = 422
    error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
    throw error
  }

  let object = new channel({
    title: request.body.title,
    description: request.body.description,
    members: request.body.members,
    date_created: new Date(),
  })

  object
    .save()
    .then(data => {
      response.status(200).json({ message: 'channel has successfully added', data: data })
    })
    .catch(err => {
      next(err)
    })
}

exports.updatechannel = (request, response, next) => {
  let errors = validationResult(request)
  if (!errors.isEmpty()) {
    let error = new Error()
    error.status = 422
    error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
    throw error
  }
  channel
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
      if (data.matchedCount == 0) throw new Error("channel isn't found")
      else response.status(201).json({ message: 'channel has successfully updated', data: data })
    })
    .catch(err => {
      next(err)
    })
}

exports.deletechannel = (request, response, next) => {
  channel
    .deleteOne({ _id: request.body.id })
    .then(data => {
      if (data.matchedCount == 0) throw new Error("channel isn't fount")
      else response.status(201).json({ message: 'channel has successfully deleted' })
    })
    .catch(err => {
      next(err)
    })
}
