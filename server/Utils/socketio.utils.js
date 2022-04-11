const DailyChat = require('../Models/DailyChatSchema')
const Channels = require('../Models/ChannelSchema')

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
function getMessagesDB(channelId, day, cb) {
  DailyChat.findOne({ _id: `${channelId}_${day}` })
    .then(data => {
      cb(data.messages)
    })
    .catch(error => console.log(error))
}

// save message to db
function saveMessageDB(message, channelId, cb) {
  let day = new Date(message.timestamp).setHours(0, 0, 0, 0)
  day = new Date(day).toISOString().slice(0, 10)

  DailyChat.findOneAndUpdate({ _id: `${channelId}_${day}` }, { $push: { messages: message } }, { upsert: true })
    .then(() => {
      return Channels.findOneAndUpdate(
        { _id: '6253a74c4ec7779082858da9' },
        { $addToSet: { messages: `${channelId}_${day}` } },
        { upsert: true },
      )
    })
    .then(() => cb())
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
