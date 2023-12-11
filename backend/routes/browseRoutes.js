const express = require('express');
const router = express.Router();
const { author } = require('../controllers/browseController');

router.post('/author', author);

module.exports = router;
