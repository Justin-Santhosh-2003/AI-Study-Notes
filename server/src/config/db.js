const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Cloudflare DNS (1.1.1.1) to resolve MongoDB Atlas SRV records
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Error: ${error.message}`);
  }
};

module.exports = connectDB;
