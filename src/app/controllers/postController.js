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
                .then(posts => {
                    posts = posts.map(posts => posts.toObject())
                    res.render('post/post', {posts, user: req.session.user});
                })
                .catch(next)
            } else {
                Post.find({user: req.session.user})
                .then(posts => {
                    posts = posts.map(posts => posts.toObject())
                    res.render('post/post', {posts, user: req.session.user});
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
        if(req.body.title != "") {
            Post.updateOne({_id: req.params.id}, {
                title: req.body.title,
                content: req.body.content,
                // image: req.file.filename,
                category: req.body.category,
                author: req.body.author,
            })
            .then(() => res.redirect('/post'))
            .catch(next)
        }
        res.render('post/editPost', {not_empty:'Error! An error occurred. Please try again.', post: req.body, user: req.session.user});
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
            res.redirect('/user/login');
        } else {
            res.render('post/createPost', {user: req.session.user});
        }
    }

    store(req, res) {
        if(req.body.title != "") {
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
                post.content = req.body.content;
                post.url = ID;
                post.category = req.body.category;
                post.user = req.session.user;
                // post.image = req.file.filename;
                post.save();
                res.redirect('/post');
            } else {
                // res.redirect('back');
                res.render('post/createPost', {message:'URL illegal. Only supports youtube videos.'});
            }
        }
        res.render('post/createPost', {not_empty:'Error! An error occurred. Please try again.'});
    }

    likes(req, res, next) {
        if(req.session.user) {
            Likes.findOne({user: req.session.user, post: req.params.id, type: 0}, function (err, results) {
                if (err) {
                    res.json({failed: true}).end();
                }
                if(results == null) {
                    const like = new Likes();
                    like.post = req.params.id;
                    like.user = req.session.user;
                    like.save();

                    Post.findById(req.params.id, function (err, post) {
                        post.likes.push(like);
                        post.save();
                    });

                    Likes.findOne({user: req.session.user, post: req.params.id, type: 1}, function (err, disliked) {
                        if(disliked != null) {
                            Post.findById(req.params.id, function (err, post) {
                                post.likes = post.likes.filter(item => item != String(disliked._id));
                                post.save();
                            });
                            Likes.deleteMany({user: req.session.user, post: req.params.id, type: 1}, function (err) {
                                if(err) res.json({failed: true}).end();
                            });
                        }
                    });

                    res.json({likes: true, id: req.params.id}).end();
                } else {
                    Post.findById(req.params.id, function (err, post) {
                        post.likes = post.likes.filter(item => item != String(results._id));
                        post.save();
                    });
                    Likes.deleteMany({user: req.session.user, post: req.params.id, type: 0}, function (err) {
                        if(err) res.json({failed: true}).end();
                    });
                    res.json({unlikes: true, id: req.params.id}).end();
                }
            });
        } else {
            res.json({failed: true}).end();
        }
    }

    dislikes(req, res, next) {
        if(req.session.user) {
            Likes.findOne({user: req.session.user, post: req.params.id, type: 1}, function (err, results) {
                if (err) {
                    res.json({failed: true}).end();
                }
                if(results == null) {
                    const like = new Likes();
                    like.post = req.params.id;
                    like.user = req.session.user;
                    like.type = 1;
                    like.save();

                    Post.findById(req.params.id, function (err, post) {
                        post.likes.push(like);
                        post.save();
                    });

                    Likes.findOne({user: req.session.user, post: req.params.id, type: 0}, function (err, liked) {
                        if(liked != null) {
                            Post.findById(req.params.id, function (err, post) {
                                post.likes = post.likes.filter(item => item != String(liked._id));
                                post.save();
                            });
                            Likes.deleteMany({user: req.session.user, post: req.params.id, type: 0}, function (err) {
                                if(err) res.json({failed: true}).end();
                            });
                        }
                    });
                    res.json({dislikes: true, id: req.params.id}).end();
                } else {
                    Post.findById(req.params.id, function (err, post) {
                        post.likes = post.likes.filter(item => item != String(results._id));
                        post.save();
                    });
                    Likes.deleteMany({user: req.session.user, post: req.params.id, type: 1}, function (err) {
                        if(err) res.json({failed: true}).end();
                    });
                    res.json({undislikes: true, id: req.params.id}).end();
                }
            });
        } else {
            res.json({failed: true}).end();
        }
    }

    comment(req, res, next) {
        if(req.session.user) {
            const comment = new Comment();
            comment.post = req.params.id;
            comment.content = req.params.content;
            comment.user = req.session.user;
            comment.save();
            Post.findById(req.params.id, function (err, post) {
                post.comments.push(comment);
                post.save();
            });
            res.json({
                success: true, 
                content: req.params.content, 
                id:comment._id,
                username: req.session.user.name
            }).end();
        } else {
            res.json({failed: true}).end();
        }
    }
    commentDelete(req, res, next) {
        if(req.session.user) {
            Comment.findById(req.params.id, function (err, comment) {
                if (err) {res.json({failed: true}).end();}
                Post.findById(comment.post, function (err, post) {
                    post.comments = post.comments.filter(item => item != String(comment._id));
                    post.save();
                });
            });
            Comment.deleteOne({_id: req.params.id}, function (err) {
                if (err) { res.json({failed: true}).end(); }
            });
            res.json({success: true, id: req.params.id}).end();
        } else {
            res.json({failed: true}).end();
        }
    }
    commentEdit(req, res, next) {
        Comment.findById(req.params.id, function (err, comment) {
            if (err) {res.json({failed: true}).end();}
            comment.content = req.params.content;
            comment.save();
            res.json({success: true, id: req.params.id, content: req.params.content}).end();
        });
    }
}

module.exports = new postController;