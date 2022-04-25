const channel = require('../Models/ChannelSchema').channel
const list = require('../Models/ChannelSchema').list
// create list
exports.createList = async (req, res, next) => {
  try {
    let object = new list({
      title: req.body.title,

      date_created: new Date(),
    })

    let data = await object.save()
    const newList = await channel.updateOne({ _id: req.body.id }, { $push: { board_lists: object._id } })
    res.json({ newList, data })
  } catch (error) {
    next(error)
  }
}
// delete list
exports.deleteList = async (req, res, next) => {
  try {
    const deleteList = await list.deleteOne({ _id: req.body.id })
    const removeList = await channel.updateOne({ board_lists: req.body.id }, { $pull: { board_lists: req.body.id } })
    res.json({ deleteList, removeList })
  } catch (error) {
    next(error)
  }
}
