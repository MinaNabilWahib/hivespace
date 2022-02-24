const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
  name: { type: String, maxlength: 30, required: true },
  admin: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  date_created: { type: Date, required: true },
  description: { type: String, maxlength: 200 },
  channels: { type: [mongoose.Types.ObjectId], ref: "Channel", required: true },
  members: { type: [mongoose.Types.ObjectId], ref: "User", required: true },
});

module.exports = mongoose.model("WorkSpace", WorkspaceSchema);
