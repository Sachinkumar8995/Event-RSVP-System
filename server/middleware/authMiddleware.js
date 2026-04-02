const User = require('../models/User');

const protect = async (req, res, next) => {
    if (req.session && req.session.user) {
        try {
            // Fetch fresh user data from DB to ensure validity and get methods if needed
            req.user = await User.findById(req.session.user._id).select('-password');

            if (!req.user) {
                // Session valid but user deleted?
                req.session.destroy();
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, session failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no session' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
