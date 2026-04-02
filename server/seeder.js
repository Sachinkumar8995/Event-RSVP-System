const mongoose = require('mongoose');
const User = require('./models/User');
require("dotenv").config();

const MONGO_URI = process.env.ATLAS_URL;

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });

        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
                password: process.env.ADMIN_PASSWORD || 'admin123',
                isAdmin: true,
                isVerified: true
            });

            console.log('Admin user created successfully.');
        } else {
            adminExists.isVerified = true;
            await adminExists.save();
            console.log('Admin already exists. Verified existing admin user.');
        }

        await mongoose.connection.close(); 
        process.exit(0);

    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedData();