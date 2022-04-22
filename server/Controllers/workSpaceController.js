const { validationResult } = require('express-validator')
const workspace = require('../Models/WorkspaceSchema')
const channel = require('../Models/ChannelSchema').channel
const user = require('../Models/UserSchema')

exports.getWorkSpace = async (request, response, next) => {
  try {
    let data = await workspace.find({ owner: request.params.userId })
    if (data.length !== 0) {
      response.status(200).json({ data })
    } else {
      let data = await workspace.find({ members: request.params.userId })
      if (data.length !== 0) {
        response.status(200).json({ data })
      } else {
        throw new Error('no workspaces')
      }
    }
  } catch (err) {
    next(err)
  }
}

exports.createWorkspace = async (request, response, next) => {
  try {
    let errors = validationResult(request)
    if (!errors.isEmpty()) {
      let error = new Error()
      error.status = 422
      error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
      throw error
    }

    let users = []
    for (const member of request.body.members) {
      let findEmail = await user.findOne({ email: member })
      if (findEmail === null) {
        throw new Error(`${member} invalid user`)
      } else {
        users.push(findEmail._id)
      }
    }

    let object = new workspace({
      title: request.body.title,
      description: request.body.description,
      members: users,
      owner: request.body.owner,
      date_created: new Date(),
    })

    let data = await object.save()

    let channelObject = new channel({
      workspaceId: await data._id,
      title: 'General Channel',
      description: 'Welcome to your First Channel you can add more channels by clicking on Add channel button',
      members: users,
      owner: request.body.owner,
      date_created: new Date(),
    })
    await channelObject.save()

    await user.updateOne({ _id: request.body.owner }, { $push: { workspaces: data._id } })
    for (const member of users) {
      await user.updateOne({ _id: member }, { $push: { workspaces: data._id } })
    }
    await workspace.updateOne({ _id: data._id }, { $push: { channels: channelObject._id } })
    response.json({ data })
  } catch (err) {
    next(err)
  }
}

exports.updateWorkSpace = async (request, response, next) => {
  try {
    let errors = validationResult(request)
    if (!errors.isEmpty()) {
      let error = new Error()
      error.status = 422
      error.message = errors.array().reduce((current, object) => current + object.msg + ' ', '')
      throw error
    }

    let users = []
    for (const member of request.body.members) {
      let findEmail = await user.findOne({ email: member })
      if (findEmail === null) {
        throw new Error(`${member} invalid user`)
      } else {
        users.push(findEmail._id)
      }
    }

    let data = await workspace.updateOne(
      { _id: request.body.id },
      {
        $set: {
          title: request.body.title,
          description: request.body.description,
          owner: request.body.owner,
          members: users,
        },
      },
    )
    if (data.matchedCount == 0) {
      throw new Error("workspace isn't found")
    } else {
      await user.updateMany({ workspaces: request.body.id }, { $pull: { workspaces: request.body.id } })
      await user.updateOne({ _id: request.body.owner }, { $push: { workspaces: request.body.id } })
      for (const member of users) {
        await user.updateOne({ _id: member }, { $push: { workspaces: request.body.id } })
        response.status(201).json({ message: 'workspace has successfully updated', data: data })
      }
    }
  } catch (err) {
    next(err)
  }
}

exports.deleteWorkSpace = async (request, response, next) => {
  try {
    let thisWorkspace = await workspace.findOne({ _id: request.body.workspace })
    for (const singleChannel of thisWorkspace.channels) {
      await channel.deleteOne({ _id: singleChannel })
    }

    let data = await workspace.deleteOne({ _id: request.body.workspace })
    if (data.deletedCount == 0) throw new Error("workspace isn't fount")
    else response.status(201).json({ message: 'workspace has successfully deleted' })
    await user.updateMany({ workspaces: request.body.workspace }, { $pull: { workspaces: request.body.workspace } })
  } catch (err) {
    next(err)
  }
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
