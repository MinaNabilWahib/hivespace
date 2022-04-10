const channel = require('../Models/ChannelSchema')

// create list
exports.createList = async (req, res, next) => {
  try {
    const list = await channel.updateOne({ _id: req.body.id }, { $push: { board_lists: req.body.list } })
    res.json(list)
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
