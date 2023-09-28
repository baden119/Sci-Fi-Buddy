const express = require('express');
const router = express.Router();
const { autocomplete, array } = require('../controllers/searchController');

router.post('/autocomplete', autocomplete);
router.post('/array', array);

module.exports = router;
