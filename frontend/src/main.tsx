import { StrictMode, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from '@/pages/Dashboard';
import Bots from '@/pages/Bots';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import { useAuth } from '@/store/auth';
import '@/styles/index.css';

function PrivateRoute({ children }: { children: ReactElement }) {
  const isAuthed = useAuth((s) => s.isAuthenticated);
  return isAuthed ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'bots', element: <Bots /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
