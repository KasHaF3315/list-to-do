/**
 * Configuration file for the Todo application
 * Contains environment-specific settings
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests - environment-aware configuration
  baseUrl: (() => {
    // Check for environment variable first (for production deployments)
    if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_API_URL) {
      return (window as any).__NEXT_DATA__.env.NEXT_PUBLIC_API_URL;
    }
    
    // Runtime environment detection
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      // Production/deployed environments
      if (hostname.includes('netlify.app') || hostname.includes('vercel.app')) {
        return `${protocol}//todoapp-backend.onrender.com`;
      }
      
      // Dev tunnels
      if (hostname.includes('devtunnels.ms') || hostname.includes('inc1.devtunnels.ms')) {
        // More robust tunnel URL handling
        let backendUrl = window.location.origin;
        
        // Try different patterns for tunnel URLs
        if (backendUrl.includes('-3000.')) {
          backendUrl = backendUrl.replace('-3000.', '-5000.');
        } else if (backendUrl.includes(':3000')) {
          backendUrl = backendUrl.replace(':3000', ':5000');
        } else {
          // Fallback: construct backend URL manually
          backendUrl = `${protocol}//${hostname.replace('3000', '5000')}`;
        }
        
        console.log('Dev tunnel detected:', {
          frontend: window.location.origin,
          backend: backendUrl,
          hostname: hostname
        });
        
        return backendUrl;
      }
      
      // Local development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
      }
      
      // Network access (LAN) - use your IP as fallback
      return `${protocol}//192.168.43.236:5000`;
    }
    
    // Server-side fallback
    return process.env.NEXT_PUBLIC_API_URL || 'http://192.168.43.236:5000';
  })(),
  
  // API endpoints
  endpoints: {
    // Auth endpoints
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      me: '/api/auth/me',
    },
    
    // Todo endpoints
    todos: '/api/todos',
    todoStats: '/api/todos/stats',
  },
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,
  },
};

// Default values
export const DEFAULT_VALUES = {
  // Default priority for new todos
  defaultPriority: 'medium' as 'low' | 'medium' | 'high',
  
  // Default user ID for guest users
  defaultUserId: 'guest',
  
  // Default pagination
  defaultPageSize: 10,
  
  // Default categories
  defaultCategories: ['personal', 'work', 'shopping', 'health', 'education'],
};

// Environment configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Feature flags
  features: {
    enableGuestMode: true,
    enableOfflineMode: true,
    enableRealTimeSync: false,
  },
};