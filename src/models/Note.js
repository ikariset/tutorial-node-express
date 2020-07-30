const mongoose = require('mongoose')

const EntitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model('Note', EntitySchema)