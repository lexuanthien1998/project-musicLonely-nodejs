const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Likes = new Schema({
    type: {type: Number, default: 0},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'likes' });

module.exports = mongoose.model('Likes', Likes);