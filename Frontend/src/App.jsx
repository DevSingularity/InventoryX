import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { PrivateRoute, RoleBasedRoute } from './routes';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Inventory from './features/inventory/Inventory';
import Employees from './features/employees/Employees';
import { ROUTES, ROLES } from './constants';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.INVENTORY}
        element={
          <PrivateRoute>
            <Layout>
              <Inventory />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.EMPLOYEES}
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout>
                <Employees />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}

export default App;
