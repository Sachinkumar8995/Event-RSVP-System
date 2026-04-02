const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:eventId').get(getComments);
router.route('/').post(protect, addComment);
router.route('/:id').delete(protect, deleteComment);

module.exports = router;
