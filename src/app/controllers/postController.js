const Post = require('../models/Post');
const Likes = require('../models/Likes');
const Comment = require('../models/Comment');

class postController {
    index(req, res, next) {
        if(!req.session.user) {
            res.redirect('/');
        } else {
            if(req.session.user.role_id == 1) {
                Post.find({})
                .then(post => {
                    post = post.map(post => post.toObject())
                    res.render('post/post', {post, user: req.session.user});
                })
                .catch(next)
            } else {
                Post.find({user_id: req.session.user._id})
                .then(post => {
                    post = post.map(post => post.toObject())
                    res.render('post/post', {post, user: req.session.user});
                })
                .catch(next)
            }
        }
    }

    show(req, res, next) {
        Post.findOne({slug: req.params.slug})    
            .then(post => res.render('post/details', {post: post.toObject()}))
            .catch(next)
    };

    edit(req, res, next) {
        if(!req.session.user) {
            res.redirect('/');
        } else {
            Post.findById(req.params.id)
            .then(post => res.render('post/editPost', {post: post.toObject(), user: req.session.user}))
            .catch(next)
        }
    }

    update(req, res, next) {
        Post.updateOne({_id: req.params.id}, {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            image: req.file.filename,
            category: req.body.category,
            author: req.body.author,
        })
        .then(() => res.redirect('/post'))
        .catch(next)
    }

    delete(req, res, next) {
        if(!req.session.user) {
            res.redirect('/');
        } else {
            Post.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/post'))
            .catch(next)
        }
    }

    create(req, res) {
        if(!req.session.user) {
            res.redirect('/');
        } else {
            res.render('post/createPost', {user: req.session.user});
        }
    }

    store(req, res) {
        var url = req.body.url;
        var myRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
        if(myRegex.test(url)) {
            var ID = '';
            url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if(url[2] !== undefined) {
                ID = url[2].split(/[^0-9a-z_\-]/i);
                ID = ID[0];
            }
            else {
                ID = url;
            }
            const post = new Post();
            post.title = req.body.title;
            post.description = req.body.description;
            post.content = req.body.content;
            post.url = ID;
            post.category = req.body.category;
            post.user = req.session.user;
            // post.image = req.file.filename;
            post.save();
            res.redirect('/post');
        } else {
            // res.redirect('back');
            req.flash('info', 'Flashed message');
            res.render('post/createPost', {message:'Website gà mờ hiện tại chỉ hỗ trợ Video Youtube. Mong bạn thông cảm !'});
        }
    }

    likes(req, res, next) {
        if(req.session.user) {
            Post.findById(req.params.post_id, function (err, post) {
                if (err) {res.json({failed: true}).end();}
                post.likes += 1;
                post.save();
            });

            const like = new Likes();
            like.post_id = req.params.post_id;
            like.user = req.session.user;
            like.save();
            
            res.json({success: true, post_id: req.params.post_id}).end();
        } else {
            res.json({failed: true}).end();
        }
    }

    unlikes(req, res, next) {
        if(req.session.user) {
            Post.findById(req.params.post_id, function (err, post) {
                if (err) {
                    res.json({failed: true}).end();
                }
                if(post.likes <= 0) {
                    post.likes = 0;
                } else {
                    post.likes -= 1;
                }
                post.save();
            });

            Likes.deleteOne({user: req.session.user._id, post_id: req.params.post_id}, function (err) {
                if (err) return handleError(err);
            });
            
            res.json({success: true, post_id: req.params.post_id}).end();
        } else {
            res.json({failed: true}).end();
        }
    }

    addViews(req, res, next) {
        Post.findById(req.params.post_id, function (err, post) {
            if (err) {
                res.json({failed: true}).end();
            }
            post.views += 1;
            post.save();
            res.end();
        });
    }

    comment(req, res, next) {
        if(req.session.user) {
            const comment = new Comment();
            comment.post_id = req.params.post_id;
            comment.content = req.params.comment;
            comment.user = req.session.user;
            comment.save();
            res.json({success: true, comment: req.params.comment, id:comment._id}).end();
        } else {
            res.json({failed: true}).end();
        }
    }
    commentDelete(req, res, next) {
        if(req.session.user) {
            Comment.deleteOne({_id: req.params.comment_id}, function (err) {
                if (err) { res.json({failed: true}).end(); }
            });
            res.json({success: true, id: req.params.comment_id}).end();
        } else {
            res.json({failed: true}).end();
        }
    }
    commentEdit(req, res, next) {
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {res.json({failed: true}).end();}
            comment.content = req.params.comment_content;
            comment.save();
            res.json({success: true, id: req.params.comment_id, content: req.params.comment_content}).end();
        });
    }
}

module.exports = new postController;