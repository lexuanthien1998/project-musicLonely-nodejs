const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name: {type: String, maxlength: 255},
    email: {type: String, maxlength: 5000},
    password: {type: String, maxlength: 255},
    role_id: {type: Number, maxlength: 255, default: 0},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
    likes: [{type: Schema.Types.ObjectId, ref: 'Likes'}],
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  }, { collection: 'users' });

module.exports = mongoose.model('User', User);