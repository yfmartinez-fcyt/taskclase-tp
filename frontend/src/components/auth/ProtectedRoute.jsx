import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderizar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
