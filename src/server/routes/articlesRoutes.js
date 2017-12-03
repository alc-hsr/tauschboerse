'use strict';

const router = require('express').Router();
const articlesController = require('../controller/articlesController');
const authenticationMiddleware = require('../middleware/authentication');

router.get('/', articlesController.findArticles);
router.post('/', authenticationMiddleware, articlesController.createArticle);
router.get('/:articleId', articlesController.getArticleById);

module.exports = router;
