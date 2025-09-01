import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
export default function Card({ title, children }) {
  return _jsxs('div', {
    className: 'bg-white rounded shadow p-4',
    children: [
      title &&
        _jsx('h2', {
          className: 'text-lg font-semibold mb-2',
          children: title,
        }),
      children,
    ],
  });
}
