const mongoose = require('mongoose')
async function connectToDb() {
  try {
    await mongoose.connect('mongodb://0.0.0.0:27017/Podcast')
    console.log(' DB connected ....')
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectToDb
