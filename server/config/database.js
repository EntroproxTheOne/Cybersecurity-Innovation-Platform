const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/think-ai-3');

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection error:', error);
    console.log('⚠️  Continuing without database connection for development...');
    // Don't exit in development mode
  }
};

module.exports = connectDB;
