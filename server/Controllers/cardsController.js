const channel = require('../Models/ChannelSchema')

// create card
exports.createCard = async (req, res, next) => {
  try {
    const card = await channel.updateOne(
      { _id: req.body.id, 'board_lists._id': req.body.list },
      // { board_lists: req.body.list },
      { $push: { cards: { _id: req.body.card.id } } },
    )
    res.json(card)
  } catch (error) {
    next(error)
  }
}

///////////
// delete card
exports.deleteCard = async (req, res, next) => {
  try {
    const card = await channel.updateOne(
      { _id: req.body.id, 'board_lists._id': req.body.list },
      // { board_lists: req.body.list },
      { $pull: { cards: { _id: req.body.card.id } } },
    )
    res.json(card)
  } catch (error) {
    next(error)
  }
}
