const express = require('express');
const router = express.Router();
const { author, title } = require('../controllers/browseController');

router.post('/author', author);
router.post('/title', title);

module.exports = router;
