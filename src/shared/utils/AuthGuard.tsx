import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/shared/slice/auth.slice';

export default function AuthGuard() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
}
