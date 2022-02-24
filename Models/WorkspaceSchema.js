const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
  title: { type: String, maxlength: 30, required: true },
  description: { type: String, maxlength: 200 },
  owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  direct_messages: { type: mongoose.Types.ObjectId, ref: "Channel" },
  channels: [ { type: mongoose.Types.ObjectId, ref: "Channel", required: true }],
  booked_offline_offices: Object,
  invitations: [ { type: mongoose.Types.ObjectId, ref:"User" }],
  date_Created: { type: Date, required: true },
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
