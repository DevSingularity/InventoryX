export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Inventory
  INVENTORY: '/components',
  INVENTORY_ITEM: (id) => `/components/${id}`,
  
  // Employees
  EMPLOYEES: '/users',
  EMPLOYEE: (id) => `/users/${id}`,
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_TIMEOUT = 10000;
