import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
export default function App() {
  return _jsxs('div', {
    className: 'min-h-screen bg-gray-50',
    children: [
      _jsx(Navbar, {}),
      _jsx('main', {
        className: 'p-6 max-w-5xl mx-auto',
        children: _jsx(Outlet, {}),
      }),
    ],
  });
}
