const express = require('express');
const router = express.Router();
const { autocomplete } = require('../controllers/searchController');

router.post('/autocomplete', autocomplete);

module.exports = router;
