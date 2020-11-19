const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');

//HomeController.index
router.get('/about-me', homeController.aboutMe);
router.get('/list/post', homeController.list);
router.get('/details/:slug', homeController.show);
router.get('/', homeController.index);
module.exports = router;