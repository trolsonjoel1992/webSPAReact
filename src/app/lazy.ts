import { lazy } from 'react';

// layouts
export const MainLayout = lazy(() => import('@/layouts/MainLayout'));

// screens
export const Home = lazy(() => import('@/screens/Home'));
export const NotFound = lazy(() => import('@/screens/NotFound'));
export const Auth = lazy(() => import('@/screens/Auth'));
export const CreatePublication = lazy(
  () => import('@/screens/CreatePublication')
);
