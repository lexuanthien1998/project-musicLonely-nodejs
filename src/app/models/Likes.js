const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Likes = new Schema({
    post_id: {type: String, maxlength: 255},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'likes' });

module.exports = mongoose.model('Likes', Likes);