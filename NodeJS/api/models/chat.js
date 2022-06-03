const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: { type: String},
    messages:{type: [mongoose.Schema.Types.ObjectId], ref: 'MessageSchema' },
   
});

module.exports = mongoose.model('ChatSchema', chatSchema);