const card = require('../Models/ChannelSchema').card
const list = require('../Models/ChannelSchema').list
// create card
exports.createCard = async (req, res, next) => {
  try {
    let object = new card({
      title: req.body.title,

      description: req.body.description,
      creator: req.body.creator,
      assigned_to: req.body.assogned_to,

      due_date: req.body.due_date,

      date_created: new Date(),
    })

    let data = await object.save()
    const newCard = await list.updateOne({ _id: req.body.id }, { $push: { cards: object._id } })
    res.json({ newCard, data })
  } catch (error) {
    next(error)
  }
}

///////////
// delete card
exports.deleteCard = async (req, res, next) => {
  try {
    const deleteCard = await card.deleteOne({ _id: req.body.id })
    const removeCard = await list.updateOne({ cards: req.body.id }, { $pull: { cards: req.body.id } })
    res.json({ deleteCard, removeCard })
  } catch (error) {
    next(error)
  }
}
