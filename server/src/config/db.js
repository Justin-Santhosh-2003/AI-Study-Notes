const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-study-notes');
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Error: ${error.message}`);
    // Note: Do not exit process immediately in dev so app remains up for health checks
  }
};

module.exports = connectDB;
