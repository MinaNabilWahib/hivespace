const mongoose = require('mongoose')

//Schema of comments that are embedded inside of Cards
const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 200 },
  sender: { type: mongoose.Types.ObjectId, required: true },
  date_created: { type: Date, required: true },
})

//Schema of cards that are embedded inside Lists
const CardSchema = new mongoose.Schrma({
  title: { type: String, required: true, maxlength: 20 },
  description: { type: String, maxlength: 200 },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  assigned_to: { type: mongoose.Types.ObjectId, ref: 'User' },
  comments: [CommentSchema],
  due_date: { type: Date },
  date_created: { type: Date, required: true },
})

//Schema of lists that are embedded inside of Channels
const ListSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 20 },
  cards: [CardSchema],
  date_created: { type: Date, required: true },
})

//Schema of Channels
const ChannelSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 20 },
  description: { type: String, maxlength: 200 },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Types.ObjectId, ref: 'DailyChat' }],
  board_lists: [ListSchema],
  date_created: { type: Date, required: true },
})

module.exports = mongoose.model('Channel', ChannelSchema)

/**Updates:
 * 1- description is not required
 * 2- messages refferes to dailychat not message
 * 3- baord_lists is not reffered instead it is embedded
 * 4- added subschemas: list, card, comment.
 */
