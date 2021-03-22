const User = require('../models/User');
const bcrypt = require('bcrypt');

//Reset PW
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const ResetPassword = require('../models/ResetPassword');
const async = require('async');
const crypto = require('crypto');
const moment = require('moment');
//Login C2
// const Passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

class UserController {
    //REGISTER
    registerUser(req, res, next) {
        if(req.session.user) {
            res.redirect('/');
        } else {
            res.render('register-user');
        }
    }
    postRegisterUser(req, res, next) {
        var q = req.body;
        if(q.username.trim().length == 0 || q.email.trim().length == 0 || q.password.trim().length == 0) {
            res.render('register-user', {message:'All không được để trống!'});
        } else {
            //Hash Password 1
            var createHash = function (password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            }
            const userRegister = new User();
            userRegister.name = q.username;
            userRegister.email = q.email;
            userRegister.password = createHash(q.password);
            userRegister.save();
    
            res.redirect('/user/login');
        }

        ///Hash Password 2
        // bcrypt.genSalt(10,(err,salt)=> 
        // bcrypt.hash(userRegister.password,salt,
        //     (err,hash)=> {
        //         if(err) throw err;
        //             //save pass to hash
        //             newUser.password = hash;
        //         //save user
        //         newUser.save()
        //         .then((value)=>{
        //             console.log(value)
        //         res.redirect('/users/login');
        //         })
        //         .catch(value=> console.log(value));
        //     }));
        // }
    }

    //LOGIN
    loginUser(req, res) {
        if(req.session.user) {
            res.redirect('/');
        } else {
            res.render('login-user');
        }
    }

    postLoginUser(req, res) {
        var q = req.body;
        if(q.email.trim().length == 0 || q.password.trim().length == 0) {
            res.render('login-user', {message:'Email hoặc Password không được để trống!'});
        } else {
            User
            .findOne({email: q.email})
            .then(function(user) {
                if(!user) {
                    res.render('login-user', {message:'Tài khoản này không tồn tại. Vui lòng đăng ký hoặc đăng nhập bằng một Email khác.'});
                }
                if(!bcrypt.compareSync(q.password, user.password)) {
                    res.render('login-user', {message:'Mật khẩu đã nhập không chính xác.'});
                } else {
                    req.session.user = user;
                    res.redirect('/');
                }
            })
        }
    }

    //PostLogin C2
    // postLoginUser_C2(req, res) {
    //     Passport.use(new LocalStrategy({
    //         usernameField: 'email',
    //         },
    //         async function(email, password, done) {
    //             if(email.trim().length == 0 || password.trim().length == 0) {
    //                 return done(null, false);
    //             }
    //             User.findOne({ 'email' :  email }, function(user) {
    //                 if (!user){
    //                     return done(null, false, { message: 'Tài khoản này không tồn tại. Vui lòng đăng ký hoặc đăng nhập bằng một Email khác.' });                 
    //                 }
    //                 if (!bcrypt.compareSync(password, user.password)) {
    //                     return done(null, false, { message: 'Mật khẩu đã nhập không chính xác.' });
    //                 }
    //                 req.session.user = user;
    //                 return done(null, user);
    //             });
    //         }
    //     ));

    //     Passport.serializeUser((user, done) => done(null, user.id));
    //     Passport.deserializeUser((id, done) => {
    //         User.findById(id, function(err, user) {
    //             done(err, user);
    //         });
    //     });
    // }

    //LOGOUT
    logoutUser(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    resetPassword(req, res) {
        res.render('reset-password');
    }
    postresetPassword(req, res) {
        if(req.body.email.trim().length == 0) {
            res.render('reset-password', {message:'Please not empty!'});
        } else {
            async.waterfall([
                function(done) {
                    crypto.randomBytes(60, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    User
                    .findOne({email: req.body.email})
                    .then(function(user) {
                        if(!user) {
                            res.render('reset-password', {message:'Account does not exist !'});
                        } else {
                            const resetpw = new ResetPassword();
                            resetpw.email = req.body.email;
                            resetpw.token = token;
                            resetpw.expires = Date.now() + 30*60000;
                            resetpw.save(function(err) {
                                done(err, token, user);
                            });
                        }
                    })
                },
                function(token, user, done) {
                    var transporter = nodemailer.createTransport(smtpTransport({
                        service: process.env.GMAIL_SERVICE_NAME,
                        host: process.env.GMAIL_SERVICE_HOST,
                        port: process.env.GMAIL_SERVICE_PORT,
                        secure: process.env.GMAIL_SERVICE_SECURE,
                        auth: {
                            user: process.env.GMAIL_USER_NAME,
                            pass: process.env.GMAIL_USER_PASSWORD
                        }
                    }));

                    var content = '';
                    var link = req.protocol + '://' + req.headers.host + '/user/pw/?token=' + token + '\n\n';
                    content += `
                        <div style="padding:25px; font-size: 18px;">
                            <p>Someone (hopefully you) has requested a password reset for your account. Follow the link below to set a new password.</p>
                            <p>URL your password reset is take effect within 30 minutes.</p>
                            <a href="`+link+`" type="button" style="background-color:#ff7e67; font-weight: 600; padding: 10px 20px; letter-spacing: 1px; text-align: center; border-radius: 5px; color: white; border: none; display: inline-block; font-size: 16px; text-decoration: none;">Confirm Change</a>
                            <p style="margin-top: 10px;">If you don't wish to reset your password, disregard this email and no action will be taken.</p>
                            <p>Thank you !</p>
                        </div>
                    `;
                    
                    var mailOptions = {
                        from: "ʟ ᴏ ɴ ᴇ ʟ ʏ",
                        to: user.email,
                        subject: 'Reset your password',
                        html: content,
                    };
                
                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err) {
                            res.render('reset-password', {message:'Request reset password is failed !'});
                        } else {
                            res.render('reset-password', {message:'Request reset password is successful. Please check your Email to proceed with resetting your password !'});
                        }
                    });
                },
            ], function(err) {
                if (err) return next(err);
                res.redirect('/user/reset-password');
            })
        }
    }
    resetPassword_checkToken(req, res) {
        ResetPassword
        .findOne({token: req.query.token})
        .then(function(user) {
            if(!user) {
                res.render('reset-password', {message:'Token confirm reset password is incorrect or has expired !'});
            } else {
                var dateNow = moment().format('L');
                var ExpiresToken = moment(user.expires).format('L');
                if(dateNow <= ExpiresToken) {
                    var timeNow = moment().format('LTS');
                    var timeExpiresToken = moment(user.expires).format('LTS');
                    if(timeNow <= timeExpiresToken) {
                        res.render('new-pw', {email: user.email});
                    } else {
                        res.render('reset-password', {message:'Token confirm reset password is incorrect or has expired !'});
                    }
                } else {
                    res.render('reset-password', {message:'Token confirm reset password is incorrect or has expired !'});
                }
            }
        })
    }
    newPassword(req, res) {
        var q = req.body;
        if(q.email.trim().length == 0) {
            res.render('reset-password', {message:'Please recreate the new password reset url'});
        } else if(q.password.trim().length == 0 || q.passwordcf.trim().length == 0) {
            res.render('new-pw', {email: q.email, message:'Please not empty'});
        } else if(q.password != q.passwordcf) {
            res.render('new-pw', {email: q.email, message:'Enter a new password is incorrect'});
        } else {
            User
            .findOne({email: q.email})
            .then(function(user) {
                if(!user) {
                    res.render('reset-password', {message:'Please recreate the new password reset url'});
                } else {
                    var createHash = function (password) {
                        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
                    }
                    user.password = createHash(q.password);
                    user.save();
                    res.render('login-user');
                }
            })
        }
    }
}

module.exports = new UserController;