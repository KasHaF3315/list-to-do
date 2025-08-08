/**
 * Configuration file for the Todo application
 * Contains environment-specific settings
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  baseUrl: 'http://localhost:5000',
  
  // API endpoints
  endpoints: {
    // Auth endpoints
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
    },
    
    // Todo endpoints
    todos: '/api/todos',
  },
  
  // Request timeout in milliseconds
  timeout: 10000,
};

// Default values
export const DEFAULT_VALUES = {
  // Default priority for new todos
  defaultPriority: 'medium' as 'low' | 'medium' | 'high',
  
  // Default category for new todos
  defaultCategory: 'personal',
  
  // Default user ID (used as fallback)
  defaultUserId: 'current-user',
};

// Feature flags
export const FEATURES = {
  // Enable/disable tags feature
  enableTags: true,
  
  // Enable/disable due dates feature
  enableDueDates: true,
  
  // Enable/disable categories feature
  enableCategories: true,
};