const { userJoin, getCurrentUser, userLeave, formatMessage } = require('../Utils/socketio.utils')
const { getMessagesDB, saveMessageDB } = require('../Utils/socketio.utils')

class Connection {
  constructor(io, socket) {
    this.socket = socket
    this.io = io

    //Check
    console.log(`Socket ${this.socket.id} Connected`)
    // socket.emit('message', 'Connection Successful')

    socket.on('joinRoom', connectionInfo => this.joinRoom(connectionInfo))
    socket.on('message', text => this.handleMessage(text))
    socket.on('disconnect', () => this.disconnect())
    socket.on('getMessages', channelInfo => this.getMessages(channelInfo))
    socket.on('connect_error', err => {
      console.log(`Connnection error due to ${err.message}`)
    })
  }

  joinRoom({ userId, roomId }) {
    const user = userJoin(this.socket.id, userId, roomId)
    this.socket.join(user.room)
    console.log(`user ${userId} in room ${roomId}`)
    console.log(user)
  }

  sendMessage(room, message) {
    this.io.to(room).emit('message', message)
  }

  handleMessage(text) {
    const user = getCurrentUser(this.socket.id)
    const message = formatMessage(user.userId, text)

    saveMessageDB(message, user.room, data => {
      this.sendMessage(user.room, data.messages[0])
    })
  }

  getMessages({ channelId, day }) {
    getMessagesDB(channelId, day, data => {
      // this.socket.emit('message', data)
      if (data && data.messages.length > 0) {
        data.messages.forEach(message => {
          // console.log(message)
          this.socket.emit('message', message)
        })
      } else {
        this.socket.emit('message', null)
      }
    })
  }

  disconnect() {
    console.log('user left')
    userLeave(this.socket.id)
  }
}

function socketioConfig(io) {
  io.on('connection', socket => {
    new Connection(io, socket)
  })
}

module.exports = socketioConfig

//roomId = channel._id --> from db
//socketId = this.socket.id --> from socket
//userId = user._id --> from db
