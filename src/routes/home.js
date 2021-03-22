const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');

router.get('/search', homeController.search);
router.get('/details/:slug', homeController.details);
router.get('/', homeController.home);
module.exports = router;