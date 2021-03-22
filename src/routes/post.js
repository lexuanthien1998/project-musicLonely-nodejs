const express = require('express');
const { Router } = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: './src/public/uploads/' });

const postController = require('../app/controllers/postController');

router.post('/comment/edit/:id/:content', postController.commentEdit);
router.post('/comment/delete/:id', postController.commentDelete);
router.post('/comment/:id/:content', postController.comment);
router.post('/:id/likes', postController.likes);
router.post('/:id/dislikes', postController.dislikes);

router.get('/create', postController.create);
router.post('/store', upload.single('image'), postController.store);
router.get('/:id/edit', postController.edit);
router.post('/update-post/:id', upload.single('image'), postController.update);
router.post('/:id/delete', postController.delete);
router.get('/details/:slug', postController.show);
router.get('/', postController.index);

module.exports = router;