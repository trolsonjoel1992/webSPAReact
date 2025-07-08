import { Outlet } from 'react-router';

export default function MainLayout() {
  return (
    <div>
      <h1>Main Layout</h1>
      <p>This is the main layout of the application.</p>
      <Outlet />
      <footer>
        <p>&copy; 2025 My Application</p>
      </footer>
    </div>
  );
}
