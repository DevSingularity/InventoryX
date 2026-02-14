import api from '../../services/api';

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
  
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
  
  async validateToken() {
    const response = await api.get('/auth/me');
    return Boolean(response?.data?.id);
  }
  
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }
}

export default new AuthService();
