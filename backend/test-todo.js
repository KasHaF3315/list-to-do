const axios = require('axios');

const baseURL = 'http://localhost:5002';

async function testTodoAPI() {
  try {
    // First login to get token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token received');
    
    // Create a new todo with tags and dueDate
    console.log('\nCreating a new todo...');
    const newTodo = {
      title: 'Test Todo with Tags',
      description: 'This is a test todo with tags and due date',
      priority: 'high',
      category: 'testing',
      tags: ['test', 'api', 'tags'],
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      completed: false
    };
    
    const createResponse = await axios.post(
      `${baseURL}/api/todos`,
      newTodo,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('Todo created successfully:');
    console.log(JSON.stringify(createResponse.data, null, 2));
    
    const todoId = createResponse.data._id;
    
    // Get all todos
    console.log('\nFetching all todos...');
    const todosResponse = await axios.get(
      `${baseURL}/api/todos`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`Found ${todosResponse.data.length} todos`);
    
    // Update the todo
    console.log('\nUpdating todo...');
    const updateResponse = await axios.put(
      `${baseURL}/api/todos/${todoId}`,
      {
        title: 'Updated Todo Title',
        tags: ['updated', 'test'],
        dueDate: new Date(Date.now() + 172800000) // Day after tomorrow
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('Todo updated successfully:');
    console.log(JSON.stringify(updateResponse.data, null, 2));
    
    // Delete the todo
    console.log('\nDeleting todo...');
    await axios.delete(
      `${baseURL}/api/todos/${todoId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('Todo deleted successfully');
    
    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('Error during API testing:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testTodoAPI();