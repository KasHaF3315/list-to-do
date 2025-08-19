/**
 * API utility functions for making requests to the backend
 */

import { API_CONFIG } from '../config';
import { Todo, TodoFormData } from '../types';

// Get the stored auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
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
  } else if (typeof window !== 'undefined') {
    // Ensure guest token exists so backend treats as guest instead of 401
    const guest = `guest-${Date.now()}`
    localStorage.setItem('auth_token', guest)
    headers['Authorization'] = `Bearer ${guest}`
  }

  return headers;
};

// Handle API response with better error handling
const handleResponse = async (response: Response) => {
  console.log('API Response:', {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData
    });

    // Handle specific error cases
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
      }
      throw new Error('Authentication failed. Please login again.');
    }

    if (response.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }

    if (response.status === 404) {
      throw new Error('Resource not found.');
    }

    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Retry function for failed requests
const retryRequest = async (fn: () => Promise<any>, attempts: number = 3): Promise<any> => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      console.log(`Request failed, retrying... (${i + 1}/${attempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Map backend todo document to frontend Todo shape
const mapTodo = (raw: any): Todo => {
  return {
    id: raw._id || raw.id,
    title: raw.title,
    description: raw.description || '',
    completed: raw.completed || false,
    priority: raw.priority || 'medium',
    category: raw.category || 'personal',
    tags: raw.tags || [],
    dueDate: raw.dueDate ? new Date(raw.dueDate) : undefined,
    userId: raw.userId || 'guest',
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
};

// API functions
export const api = {
  // Auth functions
  auth: {
    // Register a new user
    register: async (userData: { name: string; email: string; password: string }) => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`;

      console.log('Registration attempt:', {
        url,
        baseUrl: API_CONFIG.baseUrl,
        endpoint: API_CONFIG.endpoints.auth.register,
        userData: { ...userData, password: '[HIDDEN]' }
      });

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          })
        );

        const data = await handleResponse(response);

        // Persist token like login flow
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }

        return data;
      } catch (error) {
        console.error('Registration fetch error:', error);
        throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Login user
    login: async (credentials: { email: string; password: string }) => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`;

      console.log('Login attempt:', {
        url,
        baseUrl: API_CONFIG.baseUrl,
        endpoint: API_CONFIG.endpoints.auth.login,
        credentials: { ...credentials, password: '[HIDDEN]' }
      });

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })
        );

        const data = await handleResponse(response);

        // Store the token
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }

        return data;
      } catch (error) {
        console.error('Login fetch error:', error);
        throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Get current user
    getMe: async () => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.me}`;

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            headers: createHeaders(),
          })
        );

        return await handleResponse(response);
      } catch (error) {
        console.error('GetMe fetch error:', error);
        throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Logout user
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
      }
    },
  },

  // Todo functions
  todos: {
    // Get all todos
    getAll: async (): Promise<Todo[]> => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}`;

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            headers: createHeaders(),
            credentials: 'include',
          })
        );

        const json = await handleResponse(response);
        const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        return list.map(mapTodo);
      } catch (error) {
        console.error('GetAll todos error:', error);
        throw new Error(`Failed to fetch todos: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Get todo statistics
    getStats: async () => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todoStats}`;

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            headers: createHeaders(),
          })
        );

        return await handleResponse(response);
      } catch (error) {
        console.error('GetStats error:', error);
        throw new Error(`Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Create a new todo
    create: async (todoData: TodoFormData): Promise<Todo> => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}`;

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            method: 'POST',
            headers: createHeaders(),
            credentials: 'include',
            body: JSON.stringify(todoData),
          })
        );

        const json = await handleResponse(response);
        const raw = json?.data ?? json;
        return mapTodo(raw);
      } catch (error) {
        console.error('Create todo error:', error);
        throw new Error(`Failed to create todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Update a todo
    update: async (id: string, todoData: Partial<TodoFormData>): Promise<Todo> => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}/${id}`;

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            method: 'PUT',
            headers: createHeaders(),
            credentials: 'include',
            body: JSON.stringify(todoData),
          })
        );

        const json = await handleResponse(response);
        const raw = json?.data ?? json;
        return mapTodo(raw);
      } catch (error) {
        console.error('Update todo error:', error);
        throw new Error(`Failed to update todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    // Delete a todo
    delete: async (id: string): Promise<void> => {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}/${id}`;

      try {
        const response = await retryRequest(() =>
          fetch(url, {
            method: 'DELETE',
            headers: createHeaders(),
            credentials: 'include',
          })
        );

        // Some backends return 200 with body, others 204. Just swallow the response after validation.
        if (!response.ok) await handleResponse(response);
        return;
      } catch (error) {
        console.error('Delete todo error:', error);
        throw new Error(`Failed to delete todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },
};