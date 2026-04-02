const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require("dotenv").config();

connectDB();

const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const MONGO_URI = process.env.ATLAS_URL;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: 'session_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    }
}));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/rsvp', require('./routes/rsvpRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Serve uploaded images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const Event = require('./models/Event');
const RSVP = require('./models/RSVP');

// Auto-delete expired events every hour to keep database clean
setInterval(async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const expiredEvents = await Event.find({ date: { $lt: today } });
        
        if (expiredEvents.length > 0) {
            console.log(`[Cleanup] Found ${expiredEvents.length} expired events. Deleting...`);
            const expiredEventIds = expiredEvents.map(e => e._id);
            await Event.deleteMany({ _id: { $in: expiredEventIds } });
            await RSVP.deleteMany({ event: { $in: expiredEventIds } });
            console.log(`[Cleanup] Successfully deleted expired events and their RSVPs.`);
        }
    } catch (error) {
        console.error('[Cleanup] Error during expired events cleanup:', error);
    }
}, 1000 * 60 * 60); // 1 hour

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
