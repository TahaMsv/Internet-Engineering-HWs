const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    primaryId:{ type: Number, default : null},
    name: { type: String},
    description: { type: String},
    requestIDs:{type: [ mongoose.Schema.Types.ObjectId], ref: 'RequestSchema' },
   
});

module.exports = mongoose.model('GroupSchema', groupSchema);