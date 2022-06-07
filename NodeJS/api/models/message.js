const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: { type: Number },
    sentby: { type: Number },
    receiver: { type: Number },
    message: { type: String },
    date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('MessageSchema', messageSchema);