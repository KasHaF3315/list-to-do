const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  // Get MongoDB URI from environment variables
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://KASHAFBASHIR:KASHAF@qm.jo9zpcz.mongodb.net/todoapp?retryWrites=true&w=majority';
  
  // Connection options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };

  try {
    mongoose.set('strictQuery', true);
    
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(mongoUri, options);
    
    // Log successful connection
    logger.info(`✅ MongoDB Connected to ${conn.connection.host}`, {
      database: conn.connection.name,
      host: conn.connection.host,
      port: conn.connection.port,
      connectionString: mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') // Hide credentials in logs
    });

    // Test the connection with a ping
    await conn.connection.db.command({ ping: 1 });
    logger.info('MongoDB connection test successful');
    
    return conn;
  } catch (error) {
    // Enhanced error logging
    logger.error('❌ MongoDB connection error', { 
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      connectionString: mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
    });
    
    // Exit with error code
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
