const express = require('express');
const router = express.Router();
const { createCheckoutSession, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/verify', protect, verifyPayment);

module.exports = router;
