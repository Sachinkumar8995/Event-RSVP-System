const { sendContactEmail } = require('../config/email');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide all required fields' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide a valid email address' 
            });
        }

        // Message length validation
        if (message.trim().length < 10) {
            return res.status(400).json({ 
                success: false,
                message: 'Message must be at least 10 characters long' 
            });
        }

        // Send contact email
        const result = await sendContactEmail(firstName, lastName, email, message);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Your message has been sent successfully! We will get back to you soon.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request'
        });
    }
};

module.exports = {
    submitContact,
};
