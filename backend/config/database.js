const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app';
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || undefined,
    });
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`, {
      database: conn.connection.name,
      host: conn.connection.host,
      port: conn.connection.port,
    });
  } catch (error) {
    logger.error('❌ MongoDB connection error', { error });
    process.exit(1);
  }
};

// Connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
