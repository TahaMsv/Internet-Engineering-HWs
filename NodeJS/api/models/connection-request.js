const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    connectionRequestId: { type: Number },
    senderGroupId: { type: Number },
    groupId: { type: Number },
    sent: { type: Date,default: Date.now() },
    isAccepted: { type: Boolean, default: false }
});

module.exports = mongoose.model("ConnectionRequestSchema", connectionRequestSchema);