const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: { type: Number },
    user1ID: { type: Number },
    user2ID: { type: Number },
    messages: { type: [Number], default: [] },
    lastmessageDate: { type: Date, default: null },
});

module.exports = mongoose.model('ChatSchema', chatSchema);