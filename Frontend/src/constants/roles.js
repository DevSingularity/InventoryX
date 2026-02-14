export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['inventory:read', 'inventory:write', 'employees:read', 'employees:write', 'dashboard:read'],
  [ROLES.EMPLOYEE]: ['inventory:read', 'inventory:write', 'dashboard:read'],
};
