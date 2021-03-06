const mongoose = require('mongoose')

//_id === channelID_day(YYYY-MM-DD)
const DailyChatSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  messages: [
    {
      data: { type: String },
      sender: { type: mongoose.Types.ObjectId, ref: 'User' },
      timestamp: { type: String },
    },
  ],
})

module.exports = mongoose.model('DailyChat', DailyChatSchema)
