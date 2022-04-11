const DailyChat = require('../Models/DailyChatSchema')

///creating a convo
exports.createDailyChat = async (req, res, next) => {
  try {
    const dailyChat = new DailyChat({
      message: [],
      createdAt: new Date(),
    })
    const chat = await dailyChat.save()
    res.json(chat)
  } catch (error) {
    next(error)
  }
}

///creating msg
exports.createMessage = async (req, res, next) => {
  try {
    const message = await DailyChat.updateOne({ _id: req.body.id }, { $push: { message: req.body.message } })
    res.json(message)
  } catch (error) {
    next(error)
  }
}

///// getting a convo
exports.getDailyChat = async (req, res, next) => {
  try {
    const chat = await DailyChat.findOne({ _id: req.body.id })
    res.json(chat)
  } catch (error) {
    next(error)
  }
}
////deleting a convo
exports.deletDailyChat = async (req, res, next) => {
  try {
    const deleteChat = await DailyChat.deleteOne({ _id: req.body.id })

    res.json(deleteChat)
  } catch (error) {
    next(error)
  }
}
