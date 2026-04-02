const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Helper to get Razorpay instance
const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay keys missing in .env file');
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
    const { eventId } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.price <= 0) {
            return res.status(400).json({ message: 'This is a free event' });
        }

        // Create a pending RSVP or find existing one
        let rsvp = await RSVP.findOne({ user: req.user._id, event: eventId });

        if (!rsvp) {
            rsvp = await RSVP.create({
                user: req.user._id,
                event: eventId,
                status: 'maybe', // Don't set to 'going' until paid
                paymentStatus: 'pending'
            });
        } else if (rsvp.paymentStatus === 'completed') {
            return res.status(400).json({ message: 'You have already paid for this event' });
        }

        const razorpay = getRazorpay();
        
        const options = {
            amount: event.price * 100, // Amount is in currency subunits (paise)
            currency: 'INR',
            receipt: rsvp._id.toString(),
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        rsvp.razorpayOrderId = order.id;
        await rsvp.save();

        res.json({ 
            id: order.id, 
            amount: order.amount, 
            currency: order.currency, 
            key_id: process.env.RAZORPAY_KEY_ID 
        });
    } catch (error) {
        console.error('Razorpay Session Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Payment Status
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        if (!process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay secret missing in .env file');
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
            
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const rsvp = await RSVP.findOne({ razorpayOrderId: razorpay_order_id });

            if (rsvp && rsvp.paymentStatus !== 'completed') {
                rsvp.paymentStatus = 'completed';
                rsvp.status = 'going';
                await rsvp.save();
            }

            res.json({ success: true, message: 'Payment verified' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCheckoutSession,
    verifyPayment
};
