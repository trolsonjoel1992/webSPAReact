import { Home, NotFound } from '@/app/lazy';
import MainLayout from '@/layouts/MainLayout';
import { Route, Routes } from 'react-router';

export default function Router() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
