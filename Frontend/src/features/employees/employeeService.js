import api from '../../services/api';

const toUiEmployee = (user) => ({
  id: user.id,
  name: user.full_name,
  email: user.email,
  role: user.role,
  department: 'Production',
  phone: '-',
  status: user.is_active ? 'active' : 'inactive',
  joinedDate: user.created_at,
});

class EmployeeService {
  async getAllEmployees() {
    const response = await api.get('/users/employees');
    return response.data.map(toUiEmployee);
  }
  
  async getEmployee(id) {
    const response = await api.get(`/users/employees/${id}`);
    return toUiEmployee(response.data);
  }
  
  async createEmployee(employeeData) {
    const response = await api.post('/users/employees', {
      email: employeeData.email,
      full_name: employeeData.name,
      is_active: employeeData.status !== 'inactive',
      password: employeeData.password,
    });
    return toUiEmployee(response.data);
  }
  
  async updateEmployee(id, employeeData) {
    const response = await api.patch(`/users/employees/${id}`, {
      full_name: employeeData.name,
      is_active: employeeData.status !== 'inactive',
    });
    return toUiEmployee(response.data);
  }
  
  async deleteEmployee(id) {
    await api.delete(`/users/employees/${id}`);
    return { id };
  }
  
  async getActiveEmployees() {
    const employees = await this.getAllEmployees();
    return employees.filter((emp) => emp.status === 'active');
  }
}

export default new EmployeeService();
