const mongoose = require('mongoose');

const rsvpSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    event: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' },
    status: {
        type: String,
        required: true,
        enum: ['going', 'not_going', 'maybe'],
        default: 'going'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'not_required'],
        default: 'not_required'
    },
    razorpayOrderId: { type: String },
}, {
    timestamps: true,
});

// Prevent duplicate RSVPs
rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

const RSVP = mongoose.model('RSVP', rsvpSchema);
module.exports = RSVP;
