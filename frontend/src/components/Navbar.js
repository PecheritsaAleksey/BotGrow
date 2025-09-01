import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  const linkClass = ({ isActive }) =>
    isActive ? 'font-semibold text-blue-600' : 'text-gray-600';
  return _jsx('nav', {
    className: 'bg-white shadow',
    children: _jsx('div', {
      className: 'container mx-auto px-4 py-2 flex gap-4 items-center',
      children:
        isAuthenticated &&
        _jsxs(_Fragment, {
          children: [
            _jsx(NavLink, {
              to: '/',
              end: true,
              className: linkClass,
              children: 'Dashboard',
            }),
            _jsx(NavLink, {
              to: '/bots',
              className: linkClass,
              children: 'Bots',
            }),
            _jsx(NavLink, {
              to: '/settings',
              className: linkClass,
              children: 'Settings',
            }),
            _jsxs('div', {
              className: 'ml-auto flex items-center gap-2',
              children: [
                user?.username &&
                  _jsxs('span', {
                    className: 'text-sm text-gray-500',
                    children: ['@', user.username],
                  }),
                _jsx('button', {
                  onClick: handleLogout,
                  className: 'text-sm text-red-600',
                  children: 'Logout',
                }),
              ],
            }),
          ],
        }),
    }),
  });
}
