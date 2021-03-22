const Post = require('../models/Post');
const Likes = require('../models/Likes');
const Comment = require('../models/Comment');
const axios = require('axios');

class HomeController {
    constructor(req, res) {
    }

    home(req, res) {
        // axios.get('https://www.googleapis.com/youtube/v3/videos', {
        //     params: {
        //         id: 'MjlQ3oOb8U0',
        //         key: 'AIzaSyDD4sN67NX4_2JYGvDnVqBiJPSctzZqLGA',
        //         part: 'snippet,contentDetails,statistics,status',
        //     }
        // }).then(response => {
        //     res.json({data: response.data});
        // })

        // Post.count().exec(function (err, count) {
        //     var random = Math.floor(Math.random() * count)
        //     Post.find().skip(random).limit(30).populate('likes').lean().exec(function (err, results) {
        //         if(req.session.user) {
        //             res.render('page/index', { posts: results, user: req.session.user });
        //         } else {
        //             res.render('page/index', { posts: results });
        //         }
        //     })
        // })

        Post.find().limit(30).sort({ create_at: 'desc'}).populate('likes').lean()
        .then(results => {
            if(req.session.user) {
                res.render('page/index', { posts: results, user: req.session.user });
            } else {
                res.render('page/index', { posts: results });
            }
        })
        .catch(err=>{
            res.end();
        })
    }
    details(req, res, next) {
        Promise.all([
            Post.findOne({slug: req.params.slug}).populate('likes').populate({
                path : 'comments',
                populate : {
                  path : 'user',
                  select: '_id, name',
                }
            }).populate('user').lean(),
            Post.find().limit(20).populate('likes').lean(),
        ])
        .then(results => {       
            const [post, posts] = results;
            Post.findById(post._id, function (err, post) {
                if(err) res.redirect('/');
                post.views += 1;
                post.save();
            });

            Post.count().exec(function (err, count) {
                var random = Math.floor(Math.random() * count)
                Post.find().skip(random).limit(30).populate('likes').lean().exec(function (err, results) {
                    if(req.session.user) {
                        res.render('page/details', {post: post, posts: results, user: req.session.user});
                    } else {
                        res.render('page/details', {post: post, posts: results});
                    }
                })
            })

            // if(req.session.user) {
            //     res.render('page/details', {post: post, posts: posts, user: req.session.user});
            // } else {
            //     res.render('page/details', {post: post, posts: posts});
            // }
        })
        .catch(err => {
            res.redirect('/');
        })
    }

    // index(req, res) {
    //     if(req.session.user) {
    //         Promise.all([
    //             Likes.find({ user: req.session.user._id }).lean(),
    //             Post.find().limit(30).sort({ create_at: 'desc'}).lean()
    //             //use .lean(), để chuyển thành object (== toObject())
    //         ])
    //         .then(results => {       
    //             const [likes, post] = results;
    //             res.render('page/home', {post: post, user: req.session.user, likes: likes});
    //         })
    //         .catch(err=>{
    //             console.error("Something went wrong",err);
    //         })
    //     } else {
    //         Post.find({}).limit(30).sort({ create_at: 'desc'})
    //         .then(post => {
    //             post = post.map(post => post.toObject());
    //             res.render('page/home', {post:post});
    //         })
    //     }
    // }

    // list(req, res) {
    //     if(req.session.user) {
    //         Promise.all([
    //             Likes.find({ user: req.session.user._id }).lean(),
    //             Post.find().lean()
    //             //use .lean(), để chuyển thành object (== toObject())
    //         ])
    //         .then(results => {       
    //             const [likes, post] = results;
    //             res.render('page/list-post', {post: post, user: req.session.user, likes: likes});
    //         })
    //         .catch(err=>{
    //             console.error("Something went wrong",err);
    //         })
    //     } else {
    //         Post.find({})
    //         .then(post => {
    //             post = post.map(post => post.toObject());
    //             res.render('page/list-post', {post:post});
    //         })
    //     }
    // }

    // show(req, res, next) {
    //     Post.findOne({slug: req.params.slug}, function (err, post) {
    //         if (err) {
    //             res.json({failed: true}).end();
    //         }
    //         post.views += 1;
    //         post.save();
    //         next;
    //     });

    //     if(req.session.user) {
    //         Promise.all([
    //             Likes.find({ user: req.session.user._id }).populate('user').lean(),
    //             Post.findOne({slug: req.params.slug}).populate('user').lean(),
    //             Post.find().limit(20).lean(),
    //             Comment.find().sort({ createAt: 'desc'}).populate('user').limit(20).lean(),
    //         ])
    //         .then(results => {       
    //             const [likes, post, listPost, comment] = results;
    //             res.render('page/details', {post: post, user: req.session.user, likes: likes, listPost: listPost, comment: comment});
    //         })
    //         .catch(err=>{
    //             console.error("Something went wrong",err);
    //         })
    //     } else {
    //         Promise.all([
    //             Post.findOne({slug: req.params.slug}).populate('user').lean(),
    //             Post.find().limit(20).lean(),
    //             Comment.find().sort({ createAt: 'desc'}).populate('user').limit(20).lean(),
    //         ])
    //         .then(results => {       
    //             const [post, listPost, comment] = results;
    //             res.render('page/details', {post: post, listPost: listPost, comment: comment});
    //         })
    //         .catch(err=>{
    //             console.error("Something went wrong",err);
    //         })
    //     }
    // }

    aboutMe(req, res, next) {
        res.render('page/about');
    }
}

module.exports = new HomeController;