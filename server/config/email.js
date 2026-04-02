const nodemailer = require('nodemailer');

// IMPORTANT: Replace with your Gmail credentials
// How to get App Password: https://support.google.com/accounts/answer/185833
const GMAIL_USER = 'sachinkumarmth845401@gmail.com'; // Your Gmail address
const GMAIL_APP_PASSWORD = 'ugstbkpwcrawtbeo';

// Create transporter using standard SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Send event reminder email to a user
 */
const sendEventReminder = async (userEmail, userName, event) => {
    const mailOptions = {
        from: `EventHub <${GMAIL_USER}>`,
        to: userEmail,
        subject: `Reminder: ${event.title} is coming up!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">Event Reminder</h2>
                <p>Hi ${userName},</p>
                <p>This is a friendly reminder about the upcoming event you RSVP'd to:</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1f2937;">${event.title}</h3>
                    <p style="margin: 10px 0;"><strong>Date:</strong> ${event.date}</p>
                    <p style="margin: 10px 0;"><strong>Time:</strong> ${event.time}</p>
                    <p style="margin: 10px 0;"><strong>Location:</strong> ${event.location}</p>
                    <p style="margin: 10px 0;"><strong>Category:</strong> ${event.category}</p>
                </div>
                  
                <p>${event.description}</p>
                
                <p style="margin-top: 30px;">We look forward to seeing you there!</p>
                <p style="color: #6b7280; font-size: 14px;">
                    If you can no longer attend, please update your RSVP on our platform.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${userEmail}:`, info.messageId);
        return { success: true };
    } catch (error) {
        console.error(`Error sending email to ${userEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send contact form submission email
 */
const sendContactEmail = async (firstName, lastName, email, message) => {
    const mailOptions = {
        from: `EventHub <${GMAIL_USER}>`,
        to: GMAIL_USER,
        replyTo: email,
        subject: `New Contact Form Submission from ${firstName} ${lastName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">New Contact Form Submission</h2>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 10px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                </div>

                <h3 style="color: #1f2937;">Message:</h3>
                <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1;">
                    ${message}
                </p>

                <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                    You can reply directly to this email.
                </p>
            </div>
        `,
    };

    // Also send confirmation email to user
    const confirmationEmail = {
        from: `EventHub <${GMAIL_USER}>`,
        to: email,
        subject: 'We received your message - EventHub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">Thank You!</h2>
                <p>Hi ${firstName},</p>
                <p>We've received your message and will get back to you as soon as possible.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1f2937;">Your Message:</h3>
                    <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                </div>

                <p style="margin-top: 30px;">Thank you for reaching out to EventHub!</p>
                <p style="color: #6b7280; font-size: 14px;">
                    EventHub Team<br/>
                    Email: kumarikritisingh5@gmail.com<br/>
                    Phone: +91 1234567890
                </p>
            </div>
        `,
    };

    try {
    // Send to admin
    const adminInfo = await transporter.sendMail(mailOptions);
    console.log(`Contact form email sent to admin:`, adminInfo.messageId);
        
        // Send confirmation to user
        const userInfo = await transporter.sendMail(confirmationEmail);
        console.log(`Confirmation email sent to ${email}:`, userInfo.messageId);
        
        return { success: true };
    } catch (error) {
        console.error(`Error sending contact email:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send OTP email for user verification
 */
const sendOtpEmail = async (email, name, otp) => {
    const mailOptions = {
        from: `EventHub <${GMAIL_USER}>`,
        to: email,
        subject: 'Verify your email for EventHub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                <h2 style="color: #6366f1;">Welcome to EventHub!</h2>
                <p>Hi ${name},</p>
                <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes.</p>
                
                <div style="background-color: #f3f4f6; margin: 30px auto; padding: 20px; border-radius: 8px; width: fit-content;">
                    <h1 style="color: #1f2937; letter-spacing: 5px; margin: 0; font-size: 36px;">${otp}</h1>
                </div>

                <p style="color: #6b7280; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}:`, info.messageId);
        return { success: true };
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send OTP email for password reset
 */
const sendPasswordResetOtpEmail = async (email, name, otp) => {
    const mailOptions = {
        from: `EventHub <${GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP for EventHub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                <h2 style="color: #6366f1;">Password Reset Request</h2>
                <p>Hi ${name},</p>
                <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to reset your password. This OTP is valid for 10 minutes.</p>
                
                <div style="background-color: #f3f4f6; margin: 30px auto; padding: 20px; border-radius: 8px; width: fit-content;">
                    <h1 style="color: #1f2937; letter-spacing: 5px; margin: 0; font-size: 36px;">${otp}</h1>
                </div>

                <p style="color: #6b7280; font-size: 14px;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Password reset OTP email sent to ${email}:`, info.messageId);
        return { success: true };
    } catch (error) {
        console.error(`Error sending password reset OTP to ${email}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendEventReminder,
    sendContactEmail,
    sendOtpEmail,
    sendPasswordResetOtpEmail
};
