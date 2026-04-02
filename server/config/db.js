const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.ATLAS_URL;
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`> Using Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
