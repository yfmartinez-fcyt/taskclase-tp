import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  // Si ya hay usuario, redirigir al inicio (dashboard/tareas)
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Si no hay usuario, permitir ver la página (login/registro)
  return <Outlet />;
};

export default PublicRoute;
