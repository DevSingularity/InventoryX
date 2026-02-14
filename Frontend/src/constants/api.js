export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_ITEM: (id) => `/inventory/${id}`,
  
  // Employees
  EMPLOYEES: '/employees',
  EMPLOYEE: (id) => `/employees/${id}`,
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_TIMEOUT = 10000;
