import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ROUTES } from '../constants';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default PrivateRoute;
