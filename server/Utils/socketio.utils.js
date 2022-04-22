const DailyChat = require('../Models/DailyChatSchema')
const { channel } = require('../Models/ChannelSchema')

//current users in server.
const users = []

// Join user to chat
function userJoin(socketId, userId, room) {
  const user = { socketId, userId, room }
  users.push(user)
  return user
}

// Get current user
function getCurrentUser(socketId) {
  return users.find(user => user.socketId === socketId)
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

function formatMessage(userId, text) {
  return {
    sender: userId,
    data: text,
    timestamp: new Date().getTime(),
  }
}

//get messages from db
function getMessagesDB(channelId, cb) {
  var regexp = new RegExp('^' + channelId)
  DailyChat.find({ _id: regexp })
    .populate('messages.sender', 'first_name last_name image')
    .exec((err, data) => {
      if (err) console.log(err)
      cb(data)
    })
}

// save message to db
function saveMessageDB(message, channelId, cb) {
  // console.log(message.timestamp)
  let day = new Date(message.timestamp).setHours(0, 0, 0, 0)
  // console.log(day)
  day = new Date(day).toLocaleDateString()

  // console.log(day)

  DailyChat.findOneAndUpdate({ _id: `${channelId}_${day}` }, { $push: { messages: message } }, { upsert: true })
    .then(() => {
      return channel.findOneAndUpdate(
        { _id: channelId },
        { $addToSet: { messages: `${channelId}_${day}` } },
        { upsert: true },
      )
    })
    .then(() => {
      DailyChat.findOne({ _id: `${channelId}_${day}` }, 'messages -_id')
        .select({ messages: { $elemMatch: { timestamp: `${message.timestamp}` } } })
        .populate('messages.sender', 'first_name last_name image')
        .exec((err, data) => {
          if (err) console.log(err)
          cb(data)
        })
    })
    .catch(error => console.log(error))
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage,
  saveMessageDB,
  getMessagesDB,
}
