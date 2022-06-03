const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupSchema' },
    dateOfjoin: { type: Date },
    requestIDs: { type: [mongoose.Schema.Types.ObjectId], ref: 'RequestSchema' },
    chatsIDs: { type: [mongoose.Schema.Types.ObjectId], ref: 'ChatSchema' },
});

module.exports = mongoose.model('UserSchema', userSchema);