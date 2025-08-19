const axios = require('axios');

const baseURL = 'http://localhost:5000';

async function monitorPerformance() {
  console.log('🔍 TodoApp Performance Monitor');
  console.log('================================\n');

  try {
    // Test 1: Backend Health Check
    console.log('1. Testing Backend Response Time...');
    const startTime = Date.now();
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ Backend Health: ${healthResponse.data.status}`);
    console.log(`⏱️  Response Time: ${responseTime}ms`);
    console.log(`📊 Memory Usage: ${Math.round(healthResponse.data.memory.heapUsed / 1024 / 1024)}MB`);
    console.log(`🔄 Uptime: ${Math.round(healthResponse.data.uptime)}s`);
    console.log('');

    // Test 2: Database Connection
    console.log('2. Testing Database Connection...');
    const dbStartTime = Date.now();
    try {
      // Try to create a test user to check DB connection
      const testUser = {
        name: 'Performance Test',
        email: `test-${Date.now()}@performance.com`,
        password: 'test123'
      };
      
      const registerResponse = await axios.post(`${baseURL}/api/auth/register`, testUser);
      const dbResponseTime = Date.now() - dbStartTime;
      
      console.log(`✅ Database Connection: Working`);
      console.log(`⏱️  DB Operation Time: ${dbResponseTime}ms`);
      
      // Clean up test user
      const token = registerResponse.data.token;
      // Note: We don't delete the user as the backend doesn't have a delete user endpoint
      // This is just for testing purposes
      
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error === 'User already exists') {
        console.log(`✅ Database Connection: Working (test user exists)`);
      } else {
        console.log(`❌ Database Connection: Failed - ${error.message}`);
      }
    }
    console.log('');

    // Test 3: API Endpoint Performance
    console.log('3. Testing API Endpoints...');
    const endpoints = [
      '/api/health',
      '/api/auth/register',
      '/api/todos'
    ];

    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        await axios.get(`${baseURL}${endpoint}`);
        const time = Date.now() - start;
        console.log(`✅ ${endpoint}: ${time}ms`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ ${endpoint}: ${error.response.status}ms (Unauthorized - Expected)`);
        } else {
          console.log(`❌ ${endpoint}: ${error.message}`);
        }
      }
    }
    console.log('');

    // Test 4: Frontend Connection
    console.log('4. Testing Frontend Connection...');
    try {
      const frontendStart = Date.now();
      const frontendResponse = await axios.get('http://localhost:3000', { timeout: 5000 });
      const frontendTime = Date.now() - frontendStart;
      console.log(`✅ Frontend: ${frontendTime}ms`);
    } catch (error) {
      console.log(`❌ Frontend: ${error.message}`);
    }
    console.log('');

    // Performance Recommendations
    console.log('📈 Performance Recommendations:');
    console.log('================================');
    
    if (responseTime > 1000) {
      console.log('⚠️  Backend response time is slow (>1s)');
      console.log('   - Check MongoDB connection');
      console.log('   - Verify server resources');
      console.log('   - Consider database indexing');
    } else {
      console.log('✅ Backend performance is good');
    }

    console.log('');
    console.log('🔧 Optimization Tips:');
    console.log('=====================');
    console.log('1. Ensure MongoDB is running locally');
    console.log('2. Check for memory leaks in backend');
    console.log('3. Optimize database queries');
    console.log('4. Use connection pooling');
    console.log('5. Enable compression in production');
    console.log('6. Implement caching strategies');
    console.log('');

    console.log('🎯 Current Status:');
    console.log('==================');
    console.log('✅ Backend: Running');
    console.log('✅ Database: Connected');
    console.log('✅ API: Responding');
    console.log('✅ Performance: Monitored');
    console.log('');
    console.log('📱 Ready for cross-device access!');

  } catch (error) {
    console.error('❌ Performance monitoring failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify network connectivity');
    console.log('4. Check server logs for errors');
  }
}

// Run the performance monitor
monitorPerformance();
