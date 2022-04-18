const channel = require('../Models/ChannelSchema')

// create list
exports.createList = async (req, res, next) => {
  try {
    let object = new channel.list({
      title: req.body.title,

      date_created: new Date(),
    })

    let data = await object.save()
    const newList = await channel.updateOne({ _id: req.body.id }, { $push: { board_lists: data._id } })
    res.json(newList)
  } catch (error) {
    next(error)
  }
}
// delete list
exports.deleteList = async (req, res, next) => {
  try {
    const list = await channel.updateOne({ _id: req.body.id }, { $pull: { board_lists: { _id: req.body.list.id } } })
    res.json(list)
  } catch (error) {
    next(error)
  }
}
