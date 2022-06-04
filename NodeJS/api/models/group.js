const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    primaryId:{ type: Number},
    name: { type: String},
    description: { type: String},
    recievedConnectionRequestIDs: { type: [Number], default: [] },
});

module.exports = mongoose.model('GroupSchema', groupSchema);