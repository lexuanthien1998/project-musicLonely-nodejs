const express = require('express');
const { Router } = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: './src/public/uploads/' });

const postController = require('../app/controllers/postController');

router.post('/comment/:post_id/:comment', postController.comment);
router.post('/:post_id/likes', postController.likes);
router.post('/:post_id/unlikes', postController.unlikes);
router.post('/:post_id/add-views', postController.addViews);
router.get('/create', postController.create);
router.post('/store', upload.single('image'), postController.store);
router.get('/:id/edit', postController.edit);
router.post('/update-post/:id', upload.single('image'), postController.update);
router.post('/:id/delete', postController.delete);
router.get('/details/:slug', postController.show);
router.get('/', postController.index);

module.exports = router;

// // //PostController.show
// 

// //PostController.index
// router.get('/', postController.index);