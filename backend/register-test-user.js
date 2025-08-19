const axios = require('axios');

const baseURL = 'http://localhost:5002';

async function registerTestUser() {
  try {
    console.log('Registering test user...');
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await axios.post(`${baseURL}/api/auth/register`, userData);
    
    console.log('User registered successfully:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\nYou can now use these credentials to test the todo API.');
  } catch (error) {
    console.error('Error during user registration:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
      
      if (error.response.status === 400 && error.response.data.message === 'User already exists') {
        console.log('\nA user with this email already exists. You can use these credentials to test the todo API.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Make sure the server is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the registration
registerTestUser();