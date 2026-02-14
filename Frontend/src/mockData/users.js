import { ROLES } from '../constants';

export const mockUsers = [
  {
    id: '1',
    email: 'admin@electrolyte.com',
    password: 'admin123',
    name: 'Admin User',
    role: ROLES.ADMIN,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'employee@electrolyte.com',
    password: 'employee123',
    name: 'John Doe',
    role: ROLES.EMPLOYEE,
    status: 'active',
    createdAt: '2024-01-20',
  },
];

// Mock JWT token generator
export const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

export const validateMockToken = (token) => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

export const decodeMockToken = (token) => {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};
