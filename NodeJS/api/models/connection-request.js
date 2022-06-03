const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    connectionRequestId: { type: Number },
    groupId: { type: String },
    sent: { type: Date,default: Date.now() },
    isAccepted: { type: Boolean, default: false }
});

module.exports = mongoose.model("ConnectionRequestSchema", connectionRequestSchema);