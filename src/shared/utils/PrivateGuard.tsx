import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/shared/slice/auth.slice';

export default function PrivateGuard() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to='/auth' replace />;
}
