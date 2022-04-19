const { validationResult } = require('express-validator')
const channel = require('../Models/ChannelSchema').channel
const workspace = require('../Models/WorkspaceSchema')

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

exports.addchannel = async (request, response, next) => {
  try {
    let errors = validationResult(request)
    if (!errors.isEmpty()) {
      let error = new Error()
      error.status = 422
      error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
      throw error
    }

    let object = new channel.channel({
      title: request.body.title,
      description: request.body.description,
      members: request.body.members,
      owner: request.body.owner,
      date_created: new Date(),
    })

    for (const member of request.body.members) {
      let check = await workspace.findOne({
        _id: request.body.workspaceId,
        members: { $in: [member] },
      })
      if (check === null) {
        throw new Error(`${member} isn't found as a member in this workspace`)
      } else {
        let data = await object.save()
        await workspace.updateOne({ _id: request.body.workspaceId }, { $push: { channels: data._id } })
        await response.status(200).json({ message: 'channel has successfully added', data: data })
      }
    }
  } catch (err) {
    next(err)
  }
}

exports.updatechannel = async (request, response, next) => {
  try {
    let errors = validationResult(request)
    if (!errors.isEmpty()) {
      let error = new Error()
      error.status = 422
      error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
      throw error
    }

    let data = await channel.updateOne(
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
    if (data.matchedCount == 0) {
      throw new Error("channel isn't found")
    } else {
      for (const member of request.body.members) {
        let check = await workspace.findOne({
          _id: request.body.workspaceId,
          members: { $in: [member] },
        })
        if (check === null) {
          throw new Error(`${member} isn't found as a member in this workspace`)
        } else {
          response.status(201).json({ message: 'channel has successfully updated', data: data })
        }
      }
    }
  } catch (err) {
    next(err)
  }
}

exports.deletechannel = async (request, response, next) => {
  try {
    await workspace.updateOne({ channels: request.body.channelId }, { $pull: { channels: request.body.channelId } })

    let data = await channel.deleteOne({ _id: request.body.channelId })
    if (data.deletedCount === 0) {
      throw new Error("channel isn't fount")
    } else {
      response.status(201).json({ message: 'channel has successfully deleted' })
    }
  } catch (err) {
    next(err)
  }
}
exports.addChanneltoWorkspace = async (req, res, next) => {
  try {
    const mychannel = await workspace.updateOne(
      { _id: req.body.workspaceId },
      { $push: { channels: req.body.channelId } },
    )

    res.json({ mychannel })
  } catch (error) {
    next(error)
  }
}

exports.removeChannelfromWorkspace = async (req, res, next) => {
  try {
    const mychannel = await workspace.updateOne(
      { _id: req.body.workspaceId },
      { $pull: { channels: req.body.channelId } },
    )

    res.json({ mychannel })
  } catch (error) {
    next(error)
  }
}
