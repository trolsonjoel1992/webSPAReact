import {
  Auth,
  Home,
  MainLayout,
  NotFound,
  CreatePublication,
  EditPublication,
  MyPublications,
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
          <Route path='/edit-publication/:id' element={<EditPublication />} />
          <Route path='/my-publications' element={<MyPublications />} />
        </Route>
      </Route>

      <Route element={<AuthGuard />}>
        <Route path='/auth' element={<Auth />} />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
