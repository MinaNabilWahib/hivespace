const mongoose = require('mongoose')
async function connectToDb() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hivespace')
    console.log(' DB connected ....')
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectToDb
