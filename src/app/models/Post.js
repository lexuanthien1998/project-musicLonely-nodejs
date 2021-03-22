const mongoose = require('mongoose');

const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Post = new Schema({
    title: {type: String, maxlength: 255},
    description: {type: String, maxlength: 500},
    content: {type: String, maxlength: 5000},
    url: {type: String, maxlength: 500 },
    category: {type: String},
    slug: {type:String, slug: "title"},
    views: {type: Number, maxlength: 255, default: 0},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{type: Schema.Types.ObjectId, ref: 'Likes'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
}, { collection: 'posts' });

module.exports = mongoose.model('Post', Post);