const { userJoin, getCurrentUser, userLeave, formatMessage } = require('../Utils/socketio.utils')
// const { getMessagesDB, saveMessageDB } = require("../Utils/mongo.utils")

//roomId = channel._id --> from db
//socketId = this.socket.id --> from socket
//userId = user._id --> from db
class Connection {
  constructor(io, socket) {
    this.socket = socket
    this.io = io

    socket.on('joinRoom', connectionInfo => this.joinRoom(connectionInfo))
    socket.on('message', text => this.handleMessage(text))
    socket.on('disconnect', () => this.disconnect())
    socket.on('getMessages', () => this.getMessages())
    socket.on('connect_error', err => {
      console.log(`connect_error due to ${err.message}`)
    })
  }

  joinRoom({ userId, userName, roomId }) {
    const user = userJoin(this.socket.id, userId, userName, roomId)
    this.socket.join(user.room)
  }

  sendMessage(room, message) {
    this.io.to(room).emit('message', message)
  }

  handleMessage(text) {
    const user = getCurrentUser(this.socket.id)
    const message = formatMessage(user.userId, user.username, text)

    //TODO: Add message to database//
    // saveMessageDB(message)

    this.sendMessage(user.room, message)
  }

  getMessages() {
    //TODO: Get messages from database//
    // getMessagesDB()
  }

  disconnect() {
    userLeave(this.socket.id)
  }
}

function socketioConfig(io) {
  io.on('connection', socket => {
    new Connection(io, socket)
  })
}

module.exports = socketioConfig
