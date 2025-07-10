import {
  Auth,
  Home,
  MainLayout,
  NotFound,
  CreatePublication,
} from '@/app/lazy';
import AuthGuard from '@utils/AuthGuard';
import PrivateGuard from '@utils/PrivateGuard';
import { Route, Routes } from 'react-router';

export default function Router() {
  return (
    <Routes>
      <Route element={<PrivateGuard />}>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/sell' element={<CreatePublication />} />
        </Route>
      </Route>

      <Route element={<AuthGuard />}>
        <Route path='/auth' element={<Auth />} />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
