const mongoose = require('mongoose');

const commonGroupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    commonGroups: { type: Map, default: {} },
});

module.exports = mongoose.model('CommonGroupSchema', commonGroupSchema);