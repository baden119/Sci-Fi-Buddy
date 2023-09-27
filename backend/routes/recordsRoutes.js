const express = require('express');
const router = express.Router();

const {
  createRecord,
  readRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordsController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, readRecord).post(protect, createRecord);
router.route('/:id').delete(protect, deleteRecord).put(protect, updateRecord);

module.exports = router;
