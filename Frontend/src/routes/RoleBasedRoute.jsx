import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks';
import { ROUTES } from '../constants';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { role } = useRole();

  if (!role) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const normalizedRole = role.toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default RoleBasedRoute;
