const mongoose = require('mongoose');

const signUPSchema = mongoose.Schema({
    name: { type: String},
    email: { type: String},
    password: { type: String},
});

module.exports = mongoose.model('SignUp', signUPSchema);