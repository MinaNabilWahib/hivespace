const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    name: { type: String, maxlength: 60, required: true },
    email: { type: String, maxlength: 200, required: true },
    password: { type: String, requird: true },
    workspaces: [{ type: mongoose.Types.ObjectId, ref: 'Workspace', required: true }],
    users: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
    date_Created: { type: Date, required: true },
    offices: [{ type: mongoose.Types.ObjectId, ref: 'Office', required: true }]
})

module.exports = mongoose.model('Admin', AdminSchema)