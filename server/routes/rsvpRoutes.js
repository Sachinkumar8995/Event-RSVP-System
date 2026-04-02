const express = require('express');
const router = express.Router();
const {
    rsvpToEvent,
    getMyRSVPs,
    getEventRSVPs,
} = require('../controllers/rsvpController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, rsvpToEvent);
router.get('/my', protect, getMyRSVPs);
router.get('/event/:eventId', getEventRSVPs);

module.exports = router;
