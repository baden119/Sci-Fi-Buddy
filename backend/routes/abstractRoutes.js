const express = require('express');
const router = express.Router();
const { abstractTest } = require('../controllers/abstractController');

router.route('/').get(abstractTest);

module.exports = router;
