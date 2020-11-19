const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/register', userController.registerUser);
router.post('/register', userController.postRegisterUser);

router.get('/login', userController.loginUser);
router.post('/login', userController.postLoginUser);

//POST LOGIN C2
// const Passport = require('passport');
// router.post('/login', 
//     Passport.authenticate('local', { successRedirect: '/', ailureRedirect: '/user/login', failureFlash: true }), 
//     userController.postLoginUser_C2
// );

router.get('/logout', userController.logoutUser);

module.exports = router;