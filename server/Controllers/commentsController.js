const comment = require('../Models/ChannelSchema').comment
const card = require('../Models/ChannelSchema').card
// create card
exports.createComment = async (req, res, next) => {
  try {
    let object = new comment({
      content: req.body.content,
      sender: req.body.sender,
      date_created: new Date(),
    })

    let data = await object.save()
    const newComment = await card.updateOne({ _id: req.body.id }, { $push: { comments: object._id } })
    res.json({ newComment, data })
  } catch (error) {
    next(error)
  }
}

///////////
// delete card
exports.deleteComment = async (req, res, next) => {
  try {
    const deleteComment = await comment.deleteOne({ _id: req.body.id })
    const removeComment = await card.updateOne({ cards: req.body.id }, { $pull: { comments: req.body.id } })
    res.json({ deleteComment, removeComment })
  } catch (error) {
    next(error)
  }
}
