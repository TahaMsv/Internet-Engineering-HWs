const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: { type: Number },
    userId: { type: String },
    groupId: { type: String },
    date: { type: Date ,default: Date.now()},
    isAccepted: { type: Boolean, default: false }
});

module.exports = mongoose.model("JoinRequestSchema", joinRequestSchema);