const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    primaryId: { type: Number },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    group: { type: Number },
    groupIdsInCommon: { type: [Number], default: [] },
    dateOfjoin: { type: Date, default: Date.now() },
    connectionRequestIDs: { type: [Number], default: [] },
    joinRequestIDs: { type: [Number], default: [] },
    chatsIDs: { type: Number, default: [] },
});

module.exports = mongoose.model('UserSchema', userSchema);