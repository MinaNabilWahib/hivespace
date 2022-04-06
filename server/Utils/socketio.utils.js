//current users in server.
const users = []

// Join user to chat
function userJoin(socketId, userId, username, room) {
  const user = { socketId, userId, username, room }
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

function formatMessage(userId, username, text) {
  return {
    userId,
    username,
    data: text,
    date_created: new Date().getTime(),
  }
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage,
}
