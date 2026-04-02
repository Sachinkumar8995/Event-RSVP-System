const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/User');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer storage utilizing Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'event_rsvp_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: (req, file) => `user-${req.session?.user?._id || Date.now()}-${Date.now()}`,
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Wrapper to catch multer validation errors cleanly
const uploadSingleImage = (req, res, next) => {
    const uploadMiddleware = upload.single('image');
    uploadMiddleware(req, res, function (err) {
        if (err) {
             return res.status(400).json({ message: err.message || 'Error occurred during image upload.' });
        }
        next();
    });
};

// @desc    Upload profile image
// @route   POST /api/upload/profile-image
// @access  Private
router.post('/profile-image', uploadSingleImage, async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Not authorized, please log in' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const imagePath = req.file.path; // Cloudinary provides the secure URL directly into path

        // Find user and update their profile image
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profileImage = imagePath;
        await user.save();

        // Update session and explicitly save it because it's a nested object mutation
        req.session.user.profileImage = imagePath;
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
            }
            res.json({
                message: 'Image uploaded successfully to Cloudinary',
                imageUrl: imagePath
            });
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message || 'Server error uploading file' });
    }
});

// @desc    Upload event banner image
// @route   POST /api/upload/event-banner
// @access  Private
router.post('/event-banner', uploadSingleImage, async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const imagePath = req.file.path; // Cloudinary provides the secure URL directly into path

        res.json({
            message: 'Event banner uploaded successfully to Cloudinary',
            imageUrl: imagePath
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message || 'Server error uploading file' });
    }
});

module.exports = router;
