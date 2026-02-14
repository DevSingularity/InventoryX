export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Inventory Management System',
  TOKEN_KEY: 'ims_token',
  USER_KEY: 'ims_user',
  MOCK_API_DELAY: 800,
  LOW_STOCK_THRESHOLD: 20,
  ITEMS_PER_PAGE: 10,
};

export const INVENTORY_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};
