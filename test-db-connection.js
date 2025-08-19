require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./backend/config/logger');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', 
      process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
      'Not set'
    );

    // Test with direct MongoDB driver
    const { MongoClient } = require('mongodb');
    
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app');
    
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database access
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('\nAvailable collections:');
    console.log(collections.map(c => `- ${c.name}`).join('\n') || 'No collections found');
    
    // Test inserting a document
    const testCollection = db.collection('test_connection');
    const result = await testCollection.insertOne({
      test: 'connection',
      timestamp: new Date()
    });
    
    console.log('\n✅ Successfully inserted test document:', result.insertedId);
    
    // Clean up
    await testCollection.deleteOne({ _id: result.insertedId });
    
    // Test Mongoose connection
    console.log('\nTesting Mongoose connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Mongoose connected successfully!');
    
    // Close connections
    await mongoose.disconnect();
    await client.close();
    
    console.log('\n✅ All tests completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
      errorLabels: error.errorLabels
    });
    
    // If it's an authentication error, check credentials
    if (error.code === 8000 || error.code === 18) {
      console.error('\n⚠️ Authentication failed. Please check your MongoDB credentials.');
      console.error('Make sure your username and password in the connection string are correct.');
      console.error('Current connection string (with credentials hidden):', 
        process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
        'Not set'
      );
    }
    
    process.exit(1);
  }
}

testConnection();
