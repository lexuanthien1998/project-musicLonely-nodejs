const User = require('../models/User');
const bcrypt = require('bcrypt');

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
}

module.exports = new UserController;