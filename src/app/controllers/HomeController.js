const Post = require('../models/Post');
const Likes = require('../models/Likes');
const Comment = require('../models/Comment');

class HomeController {
    constructor(req, res) {
    }

    index(req, res) {
        if(req.session.user) {
            Promise.all([
                Likes.find({ user: req.session.user._id }).lean(),
                Post.find().limit(30).sort({ create_at: 'desc'}).lean()
                //use .lean(), để chuyển thành object (== toObject())
            ])
            .then(results => {       
                const [likes, post] = results;
                res.render('page/home', {post: post, user: req.session.user, likes: likes});
            })
            .catch(err=>{
                console.error("Something went wrong",err);
            })
        } else {
            Post.find({}).limit(30).sort({ create_at: 'desc'})
            .then(post => {
                post = post.map(post => post.toObject());
                res.render('page/home', {post:post});
            })
        }
    }

    list(req, res) {
        if(req.session.user) {
            Promise.all([
                Likes.find({ user: req.session.user._id }).lean(),
                Post.find().lean()
                //use .lean(), để chuyển thành object (== toObject())
            ])
            .then(results => {       
                const [likes, post] = results;
                res.render('page/list-post', {post: post, user: req.session.user, likes: likes});
            })
            .catch(err=>{
                console.error("Something went wrong",err);
            })
        } else {
            Post.find({})
            .then(post => {
                post = post.map(post => post.toObject());
                res.render('page/list-post', {post:post});
            })
        }
    }

    show(req, res, next) {
        Post.findOne({slug: req.params.slug}, function (err, post) {
            if (err) {
                res.json({failed: true}).end();
            }
            post.views += 1;
            post.save();
            next;
        });

        if(req.session.user) {
            Promise.all([
                Likes.find({ user: req.session.user._id }).populate('user').lean(),
                Post.findOne({slug: req.params.slug}).populate('user').lean(),
                Post.find().lean(),
                Comment.find().populate('user').lean(),
            ])
            .then(results => {       
                const [likes, post, listPost, comment] = results;
                res.render('page/details', {post: post, user: req.session.user, likes: likes, listPost: listPost, comment: comment});
            })
            .catch(err=>{
                console.error("Something went wrong",err);
            })
        } else {
            Promise.all([
                Post.findOne({slug: req.params.slug}).populate('user').lean(),
                Post.find().limit(20).lean(),
                Comment.find().populate('user').lean(),
            ])
            .then(results => {       
                const [post, listPost, comment] = results;
                res.render('page/details', {post: post, listPost: listPost, comment: comment});
            })
            .catch(err=>{
                console.error("Something went wrong",err);
            })
        }
    }

    aboutMe(req, res, next) {
        res.render('page/about');
    }
}

module.exports = new HomeController;