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

            // Post.count().exec(function (err, count) {
            //     var random = Math.floor(Math.random() * count)
            //     Post.find().skip(random).limit(30).populate('likes').lean().exec(function (err, results) {
            //         if(req.session.user) {
            //             res.render('page/details', {post: post, posts: results, user: req.session.user});
            //         } else {
            //             res.render('page/details', {post: post, posts: results});
            //         }
            //     })
            // })

            if(req.session.user) {
                res.render('page/details', {post: post, posts: posts, user: req.session.user});
            } else {
                res.render('page/details', {post: post, posts: posts});
            }
        })
        .catch(err => {
            res.redirect('/');
        })
    }
    search(req, res) {
        Post.find({'title': {'$regex': req.query.q, '$options': 'i'}}).limit(30).sort({ create_at: 'desc'}).populate('likes').lean()
        .then(results => {
            if(req.session.user) {
                res.render('page/index', { posts: results, user: req.session.user, keyword : req.query.q });
            } else {
                res.render('page/index', { posts: results, keyword : req.query.q });
            }
        })
        .catch(err=>{
            res.end();
        })

    }
}

module.exports = new HomeController;