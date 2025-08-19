const axios = require('axios');

const baseURL = 'http://localhost:5000';

async function testConnection() {
  console.log('🔍 Testing TodoApp Backend Connection...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Register User
    console.log('2. Testing User Registration...');
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    let token;
    try {
      const registerResponse = await axios.post(`${baseURL}/api/auth/register`, userData);
      token = registerResponse.data.token;
      console.log('✅ User registered successfully');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error === 'User already exists') {
        console.log('ℹ️  User already exists, trying login...');
        
        // Try login instead
        const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        token = loginResponse.data.token;
        console.log('✅ User logged in successfully');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 3: Create Todo
    console.log('3. Testing Todo Creation...');
    const todoData = {
      title: 'Test Todo',
      description: 'This is a test todo item',
      priority: 'high',
      category: 'testing',
      tags: ['test', 'api'],
      dueDate: new Date(Date.now() + 86400000) // Tomorrow
    };

    const createResponse = await axios.post(`${baseURL}/api/todos`, todoData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Todo created successfully:', createResponse.data.title);
    const todoId = createResponse.data._id;
    console.log('');

    // Test 4: Get All Todos
    console.log('4. Testing Get All Todos...');
    const todosResponse = await axios.get(`${baseURL}/api/todos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Retrieved ${todosResponse.data.length || todosResponse.data.data?.length || 0} todos`);
    console.log('');

    // Test 5: Update Todo
    console.log('5. Testing Todo Update...');
    const updateData = {
      title: 'Updated Test Todo',
      completed: true
    };

    const updateResponse = await axios.put(`${baseURL}/api/todos/${todoId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Todo updated successfully:', updateResponse.data.title);
    console.log('');

    // Test 6: Get Todo Stats
    console.log('6. Testing Todo Stats...');
    const statsResponse = await axios.get(`${baseURL}/api/todos/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Todo stats retrieved:', statsResponse.data);
    console.log('');

    // Test 7: Delete Todo
    console.log('7. Testing Todo Deletion...');
    await axios.delete(`${baseURL}/api/todos/${todoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Todo deleted successfully');
    console.log('');

    console.log('🎉 All tests passed! Backend is working correctly.');
    console.log('');
    console.log('📱 You can now access the app from:');
    console.log('   - This computer: http://localhost:3000');
    console.log('   - Other devices: http://192.168.43.236:3000');
    console.log('');
    console.log('🔗 Backend API: http://192.168.43.236:5000');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Make sure the backend server is running.');
      console.error('Run: cd backend && npm run dev');
    } else {
      console.error('Error details:', error.message);
    }
    
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running (cd backend && npm run dev)');
    console.log('2. Check if MongoDB is running');
    console.log('3. Verify the backend is accessible at http://localhost:5000');
    console.log('4. Check the backend terminal for error messages');
  }
}

// Run the test
testConnection();
