const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema({
    post_id: {type: String, maxlength: 255},
    content: {type: String, maxlength: 5000},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { collection: 'comment' });

module.exports = mongoose.model('Comment', Comment);