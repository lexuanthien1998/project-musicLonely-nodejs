const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResetPassword = new Schema({
    email: {type: String, maxlength: 255},
    token: {type: String, maxlength: 500},
    expires: {type: Date},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
}, { collection: 'reset-password' });

module.exports = mongoose.model('ResetPassword', ResetPassword);