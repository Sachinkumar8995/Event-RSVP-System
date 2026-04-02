const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe, getUsers, deleteUser, makeUserAdmin, googleAuth, verifyOtp, resendOtp, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/logout', logoutUser);
router.get('/me', getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Admin Routes
router.get('/users', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/make-admin', protect, admin, makeUserAdmin);

module.exports = router;
