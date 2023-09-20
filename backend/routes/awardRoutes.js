const express = require('express');
const router = express.Router();
const { getAwards } = require('../controllers/awardController');

router.route('/:id').get(getAwards);

module.exports = router;
