import { jsx as _jsx } from 'react/jsx-runtime';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import App from './App';
import Dashboard from '@/pages/Dashboard';
import Bots from '@/pages/Bots';
import BotEdit from '@/pages/BotEdit';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import { useAuth } from '@/store/auth';
import '@/styles/index.css';
function PrivateRoute({ children }) {
  const isAuthed = useAuth((s) => s.isAuthenticated);
  return isAuthed ? children : _jsx(Navigate, { to: '/login', replace: true });
}
const router = createBrowserRouter([
  {
    path: '/',
    element: _jsx(PrivateRoute, { children: _jsx(App, {}) }),
    children: [
      { index: true, element: _jsx(Dashboard, {}) },
      { path: 'bots', element: _jsx(Bots, {}) },
      { path: 'bots/:id', element: _jsx(BotEdit, {}) },
      { path: 'settings', element: _jsx(Settings, {}) },
    ],
  },
  { path: '/login', element: _jsx(Login, {}) },
  { path: '*', element: _jsx(Navigate, { to: '/login', replace: true }) },
]);
createRoot(document.getElementById('root')).render(
  _jsx(StrictMode, { children: _jsx(RouterProvider, { router: router }) }),
);
