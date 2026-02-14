import { simulateApiDelay, simulateApiError } from '../../services/api';
import { mockUsers, generateMockToken, validateMockToken, decodeMockToken } from '../../mockData';

class AuthService {
  async login(email, password) {
    // Simulate API call
    await simulateApiDelay(null);
    
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = generateMockToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword,
    };
  }
  
  async logout() {
    await simulateApiDelay(null);
    return { success: true };
  }
  
  async validateToken(token) {
    await simulateApiDelay(null);
    return validateMockToken(token);
  }
  
  async getCurrentUser(token) {
    await simulateApiDelay(null);
    
    if (!validateMockToken(token)) {
      throw new Error('Invalid token');
    }
    
    const decoded = decodeMockToken(token);
    const user = mockUsers.find((u) => u.id === decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  async refreshToken(token) {
    await simulateApiDelay(null);
    
    if (!validateMockToken(token)) {
      throw new Error('Invalid token');
    }
    
    const decoded = decodeMockToken(token);
    const user = mockUsers.find((u) => u.id === decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return generateMockToken(user);
  }
}

export default new AuthService();
