/**
 * API utility functions for making requests to the backend
 */

import { API_CONFIG } from '../config';
import { Todo, TodoFormData } from '../types';

// Get the stored auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Create headers with authorization token
const createHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Handle API response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'An error occurred');
  }
  
  return response.json();
};

// API functions
export const api = {
  // Auth functions
  auth: {
    // Register a new user
    register: async (userData: { name: string; email: string; password: string }) => {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      return handleResponse(response);
    },
    
    // Login user
    login: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await handleResponse(response);
      
      // Store the token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    },
    
    // Logout user
    logout: () => {
      localStorage.removeItem('auth_token');
    },
  },
  
  // Todo functions
  todos: {
    // Get all todos
    getAll: async (): Promise<Todo[]> => {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}`, {
        headers: createHeaders(),
      });
      
      return handleResponse(response);
    },
    
    // Create a new todo
    create: async (todoData: TodoFormData): Promise<Todo> => {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(todoData),
      });
      
      return handleResponse(response);
    },
    
    // Update a todo
    update: async (id: string, todoData: Partial<TodoFormData>): Promise<Todo> => {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(todoData),
      });
      
      return handleResponse(response);
    },
    
    // Delete a todo
    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}/${id}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });
      
      if (response.status === 204) {
        return;
      }
      
      return handleResponse(response);
    },
  },
};