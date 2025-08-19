const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';

// Helper function to make authenticated requests
async function makeRequest(method, url, data = null, token = null, guestId = null) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (guestId) {
    headers.Cookie = `guestId=${guestId}`;
  }

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers,
      validateStatus: () => true // Don't throw on HTTP error status codes
    });
    return response;
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

// Test guest user flow
async function testGuestFlow() {
  console.log('=== Testing Guest User Flow ===');
  
  // Generate a new guest ID
  const guestId = `guest_${uuidv4()}`;
  console.log(`Using guestId: ${guestId}`);
  
  // Create a new todo as guest
  const todoData = {
    title: 'Test Todo',
    description: 'This is a test todo',
    priority: 'medium',
    completed: false
  };
  
  console.log('\n1. Creating a new todo as guest...');
  const createResponse = await makeRequest('post', '/todos', todoData, null, guestId);
  
  if (createResponse.status !== 201) {
    console.error('Failed to create todo:', createResponse.data);
    return;
  }
  
  const createdTodo = createResponse.data.data;
  console.log('Created todo:', createdTodo);
  
  // Update the todo
  const updateData = {
    title: 'Updated Test Todo',
    completed: true,
    priority: 'high'
  };
  
  console.log('\n2. Updating the todo...');
  const updateResponse = await makeRequest(
    'put', 
    `/todos/${createdTodo.id}`, 
    updateData, 
    null, 
    guestId
  );
  
  if (updateResponse.status !== 200) {
    console.error('Failed to update todo:', updateResponse.data);
    return;
  }
  
  const updatedTodo = updateResponse.data.data;
  console.log('Updated todo:', updatedTodo);
  
  // Verify the update
  if (updatedTodo.title === updateData.title && 
      updatedTodo.completed === updateData.completed &&
      updatedTodo.priority === updateData.priority) {
    console.log('\n✅ Guest todo update test passed!');
  } else {
    console.log('\n❌ Guest todo update test failed!');
  }
}

// Test authenticated user flow
async function testAuthenticatedFlow() {
  console.log('\n=== Testing Authenticated User Flow ===');
  
  // Replace with valid test user credentials
  const credentials = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  // Login to get token
  console.log('1. Logging in...');
  const loginResponse = await makeRequest('post', '/auth/login', credentials);
  
  if (loginResponse.status !== 200) {
    console.error('Login failed:', loginResponse.data);
    console.log('\n⚠️  Please create a test user first or check credentials');
    return;
  }
  
  const { token } = loginResponse.data;
  console.log('Logged in successfully');
  
  // Create a new todo
  const todoData = {
    title: 'Auth Test Todo',
    description: 'This is an authenticated test todo',
    priority: 'medium',
    completed: false
  };
  
  console.log('\n2. Creating a new todo...');
  const createResponse = await makeRequest('post', '/todos', todoData, token);
  
  if (createResponse.status !== 201) {
    console.error('Failed to create todo:', createResponse.data);
    return;
  }
  
  const createdTodo = createResponse.data.data;
  console.log('Created todo:', createdTodo);
  
  // Update the todo
  const updateData = {
    title: 'Updated Auth Test Todo',
    completed: true,
    priority: 'high'
  };
  
  console.log('\n3. Updating the todo...');
  const updateResponse = await makeRequest(
    'put', 
    `/todos/${createdTodo._id}`, 
    updateData, 
    token
  );
  
  if (updateResponse.status !== 200) {
    console.error('Failed to update todo:', updateResponse.data);
    return;
  }
  
  const updatedTodo = updateResponse.data.data;
  console.log('Updated todo:', updatedTodo);
  
  // Verify the update
  if (updatedTodo.title === updateData.title && 
      updatedTodo.completed === updateData.completed &&
      updatedTodo.priority === updateData.priority) {
    console.log('\n✅ Authenticated todo update test passed!');
  } else {
    console.log('\n❌ Authenticated todo update test failed!');
  }
}

// Run tests
async function runTests() {
  try {
    await testGuestFlow();
    await testAuthenticatedFlow();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();
