import { jsx as _jsx } from 'react/jsx-runtime';
import Card from '@/components/Card';
export default function Dashboard() {
  return _jsx(Card, {
    title: 'Dashboard',
    children: _jsx('p', { children: 'Welcome to the dashboard.' }),
  });
}
