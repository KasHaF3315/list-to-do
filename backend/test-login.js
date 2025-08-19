ole.log('🚀 Testing TodoApp Login API...');

  try {
    // Test login endpoint
    console.log('\n1. Testing User Login...');
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('User details from database:');
      console.log('- ID:', loginData.user.id);
      console.log('- Name:', loginData.user.name);
      console.log('- Email:', loginData.user.email);
      
      // You can add more tests here using the token if needed
      const token = loginData.token;
      console.log('\nAuthentication token received successfully');
    } else {
      const error = await loginResponse.json();
      console.log('❌ Login failed:', error);
      console.log('\nTry running test-api.js first to create a test user');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testLoginAPI();
}

module.exports = { testLoginAPI };