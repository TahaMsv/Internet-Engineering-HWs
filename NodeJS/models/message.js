const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sender: { type: String},
    receiver: { type: String},
    content: { type: String},
    sentTime:{type: Date},
});

module.exports = mongoose.model('MessageSchema', messageSchema);