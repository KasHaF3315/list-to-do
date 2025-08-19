// Database Check Script
// Run with: node check-database.js

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://KASHAFBASHIR:KASHAF@qm.jo9zpcz.mongodb.net/todoapp?retryWrites=true&w=majority&appName=qm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema (must match the one in server.js)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkDatabase() {
  try {
    console.log('🔍 Checking database for users...');
    
    // Find all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found in the database.');
    } else {
      console.log(`✅ Found ${users.length} users in the database:`);
      
      // Display each user
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log('- ID:', user._id);
        console.log('- Name:', user.name);
        console.log('- Email:', user.email);
        console.log('- Created:', user.createdAt);
      });
      
      // Check for specific user
      console.log('\n🔍 Checking for user with email: bahirkshaf123@gmail.com');
      const specificUser = await User.findOne({ email: 'bahirkshaf123@gmail.com' });
      
      if (specificUser) {
        console.log('✅ User found:');
        console.log('- ID:', specificUser._id);
        console.log('- Name:', specificUser.name);
        console.log('- Email:', specificUser.email);
        console.log('- Created:', specificUser.createdAt);
      } else {
        console.log('❌ User with email bahirkshaf123@gmail.com not found in the database.');
        console.log('\nPossible reasons:');
        console.log('1. The registration request did not reach the server');
        console.log('2. There was an error during registration');
        console.log('3. The email address was entered differently');
      }
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the function
checkDatabase();