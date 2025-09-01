import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import { listBots, deleteBot } from '@/shared/api';
export default function Bots() {
  const [bots, setBots] = useState([]);
  const navigate = useNavigate();
  const load = () => listBots().then(setBots);
  useEffect(() => {
    load();
  }, []);
  const handleDelete = async (id) => {
    if (!confirm('Delete this bot?')) return;
    await deleteBot(id);
    load();
  };
  return _jsxs(Card, {
    title: 'Bots',
    children: [
      _jsx('div', {
        className: 'mb-4',
        children: _jsx(Link, {
          to: '/bots/new',
          className: 'bg-blue-500 text-white px-3 py-1 rounded',
          children: 'Create Bot',
        }),
      }),
      _jsxs('table', {
        className: 'min-w-full text-left',
        children: [
          _jsx('thead', {
            children: _jsxs('tr', {
              children: [
                _jsx('th', { className: 'py-2', children: 'Name' }),
                _jsx('th', { className: 'py-2', children: 'Status' }),
                _jsx('th', { className: 'py-2', children: 'Token' }),
                _jsx('th', {}),
              ],
            }),
          }),
          _jsx('tbody', {
            children: bots.map((b) =>
              _jsxs(
                'tr',
                {
                  className: 'border-t',
                  children: [
                    _jsx('td', { className: 'py-2', children: b.name }),
                    _jsx('td', {
                      className: 'py-2',
                      children: _jsx('span', {
                        className:
                          b.status === 'connected'
                            ? 'text-green-600'
                            : b.status === 'error'
                              ? 'text-red-600'
                              : 'text-gray-500',
                        children: '\u25CF',
                      }),
                    }),
                    _jsx('td', {
                      className: 'py-2 font-mono',
                      children: b.tokenMasked,
                    }),
                    _jsxs('td', {
                      className: 'py-2 space-x-2',
                      children: [
                        _jsx('button', {
                          className: 'text-blue-600',
                          onClick: () => navigate(`/bots/${b.id}`),
                          children: 'Open',
                        }),
                        _jsx('button', {
                          className: 'text-red-600',
                          onClick: () => handleDelete(b.id),
                          children: 'Delete',
                        }),
                      ],
                    }),
                  ],
                },
                b.id,
              ),
            ),
          }),
        ],
      }),
    ],
  });
}
