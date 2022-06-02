const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    requestType: {
        type: String,
        enum: ["join", "connection"],
        require: true
    },
    sender: { type: String },
    receiver: { type: String },
    sentTime: { type: Date },
    isAccepted:{type: Boolean}
});

module.exports = mongoose.model("RequestSchema", requestSchema);