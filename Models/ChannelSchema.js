const mongoose = require("mongoose");
const ChannelSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 20 },
  description: { type: String, required: true, max: 200 },
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Types.ObjectId, ref: "Messages" }],
  board_lists: [{ type: mongoose.Types.ObjectId, ref: "Lists" }],
  createdAt: { type: Date, required: "true" },
});
module.exports = mongoose.model("Channel", ChannelSchema);
