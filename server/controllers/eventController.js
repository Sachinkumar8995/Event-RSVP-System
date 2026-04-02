const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                  $or: [
                      { title: { $regex: req.query.search, $options: 'i' } },
                      { description: { $regex: req.query.search, $options: 'i' } },
                      { location: { $regex: req.query.search, $options: 'i' } }
                  ]
              }
            : {};

        const categoryFilter = req.query.category && req.query.category !== 'All' 
            ? { category: req.query.category } 
            : {};

        const query = { ...keyword, ...categoryFilter };

        // Support optional pagination
        if (req.query.page || req.query.limit) {
            const pageSize = Number(req.query.limit) || 12;
            const page = Number(req.query.page) || 1;

            const count = await Event.countDocuments(query);
            const events = await Event.find(query)
                .sort({ date: 1 })
                .limit(pageSize)
                .skip(pageSize * (page - 1));

            return res.json({
                events,
                page,
                pages: Math.ceil(count / pageSize),
                total: count
            });
        }

        // Default behavior (no pagination) returns an array
        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    const { title, description, date, time, location, category, bannerImage, price, registrationDeadline } = req.body;

    try {
        const event = new Event({
            user: req.user._id,
            title,
            description,
            date,
            time,
            location,
            category,
            bannerImage,
            registrationDeadline,
            price: price || 0,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    const { title, description, date, time, location, category, bannerImage, price, registrationDeadline } = req.body;

    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            event.title = title || event.title;
            event.description = description || event.description;
            event.date = date || event.date;
            event.time = time || event.time;
            event.location = location || event.location;
            event.category = category || event.category;
            if (bannerImage !== undefined) event.bannerImage = bannerImage;
            if (price !== undefined) event.price = price;
            if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline;

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            // Also remove RSVPs
            await RSVP.deleteMany({ event: event._id });
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Send reminder emails to all RSVP'd users
// @route   POST /api/events/:id/send-reminder
// @access  Private/Admin
const sendEventReminders = async (req, res) => {
    try {
        const { sendEventReminder } = require('../config/email');
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get all RSVPs for this event with "going" or "maybe" status
        const rsvps = await RSVP.find({
            event: event._id,
            status: { $in: ['going', 'maybe'] }
        }).populate('user', 'name email');

        if (rsvps.length === 0) {
            return res.status(404).json({ message: 'No users have RSVP\'d to this event' });
        }

        // Send emails to all users
        const results = [];
        for (const rsvp of rsvps) {
            if (rsvp.user && rsvp.user.email) {
                const result = await sendEventReminder(
                    rsvp.user.email,
                    rsvp.user.name,
                    event
                );
                results.push({
                    email: rsvp.user.email,
                    success: result.success
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        res.json({
            message: `Reminder emails sent to ${successCount} user(s)`,
            total: rsvps.length,
            success: successCount,
            failed: failCount,
            details: results
        });
    } catch (error) {
        console.error('Error sending reminders:', error);
        res.status(500).json({ message: 'Failed to send reminder emails: ' + error.message });
    }
};

// @desc    Get all events created by the logged in user (Host)
// @route   GET /api/events/host/my-events
// @access  Private
const getHostEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get detailed stats for a specific event created by the Host
// @route   GET /api/events/host/:id/stats
// @access  Private
const getHostEventStats = async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, user: req.user._id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found or you are not the host' });
        }

        const rsvps = await RSVP.find({ event: event._id }).populate('user', 'name email profileImage');
        
        // Calculate status counts for pie chart
        const statusCounts = { going: 0, maybe: 0, not_going: 0 };
        rsvps.forEach(r => {
            if (statusCounts[r.status] !== undefined) {
                statusCounts[r.status]++;
            }
        });

        // Calculate total revenue if paid event
        let totalRevenue = 0;
        if (event.price > 0) {
           const paidRSVPs = rsvps.filter(r => r.paymentStatus === 'completed' && r.status === 'going');
           totalRevenue = paidRSVPs.length * event.price;
        }

        res.json({
            event,
            stats: {
                totalRSVPs: rsvps.length,
                statusCounts,
                totalRevenue
            },
            attendees: rsvps.map(r => ({
                id: r._id,
                user: r.user,
                status: r.status,
                paymentStatus: r.paymentStatus,
                date: r.createdAt
            }))
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    sendEventReminders,
    getHostEvents,
    getHostEventStats,
};
