const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

async function testMongoDB() {
  // Use the connection string from the .env.example file
  const mongoUri = 'mongodb+srv://KASHAFBASHIR:KASHAF@qm.jo9zpcz.mongodb.net/todoapp?retryWrites=true&w=majority';
  
  console.log('Testing MongoDB connection to Atlas...');
  console.log('Connection string (with credentials hidden):', 
    mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
  );

  try {
    // Test with MongoDB native driver first
    console.log('\n1. Testing with MongoDB native driver...');
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Successfully connected with MongoDB native driver!');
    
    // List databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('\nAvailable databases:');
    console.log(dbs.databases.map(db => `- ${db.name}`).join('\n'));
    
    // Test inserting a document
    const testDb = client.db('todoapp');
    const testCollection = testDb.collection('test_connection');
    const result = await testCollection.insertOne({
      test: 'connection',
      timestamp: new Date()
    });
    console.log('✅ Successfully inserted test document:', result.insertedId);
    
    // Clean up
    await testCollection.deleteOne({ _id: result.insertedId });
    await client.close();
    
    // Test with Mongoose
    console.log('\n2. Testing with Mongoose...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Successfully connected with Mongoose!');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections in todoapp:');
    console.log(collections.map(c => `- ${c.name}`).join('\n') || 'No collections found');
    
    await mongoose.disconnect();
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
      errorLabels: error.errorLabels
    });
    
    if (error.code === 8000 || error.code === 18) {
      console.error('\n⚠️ Authentication failed. Please check your MongoDB credentials.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️ Connection refused. Is MongoDB running and accessible?');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n⚠️ Could not resolve host. Check your network connection and hostname.');
    }
    
    process.exit(1);
  }
}

testMongoDB();
