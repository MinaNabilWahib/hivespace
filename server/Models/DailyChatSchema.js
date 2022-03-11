const mongoose = require('mongoose')

const DailyChatSchema = new mongoose.Schema({
  message: [
    {
      data: { type: String },
      sender: { type: mongoose.Types.ObjectId },
      reciever: { type: mongoose.Types.ObjectId },
      createdAt: { type: Date },
    },
  ],
  createdAt: { type: Date },
})

module.exports = mongoose.model('DailyChat', DailyChatSchema)
