const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    sendEventReminders,
    getHostEvents,
    getHostEventStats
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

// Host routes must be defined before /:id to prevent routing issues
router.get('/host/my-events', protect, getHostEvents);
router.get('/host/:id/stats', protect, getHostEventStats);

router.route('/').get(getEvents).post(protect, admin, createEvent);
router
    .route('/:id')
    .get(getEventById)
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

router.post('/:id/send-reminder', protect, admin, sendEventReminders);

module.exports = router;
