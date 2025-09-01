import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Card from '@/components/Card';
import { listBots, deleteBot } from '@/shared/api';
import type { Bot } from '@/shared/types';

export default function Bots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const navigate = useNavigate();

  const load = () => listBots().then(setBots);

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bot?')) return;
    await deleteBot(id);
    load();
  };

  return (
    <Card title="Bots">
      <div className="mb-4">
        <Link
          to="/bots/new"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Create Bot
        </Link>
      </div>
      <table className="min-w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Status</th>
            <th className="py-2">Token</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {bots.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="py-2">{b.name}</td>
              <td className="py-2">
                <span
                  className={
                    b.status === 'connected'
                      ? 'text-green-600'
                      : b.status === 'error'
                        ? 'text-red-600'
                        : 'text-gray-500'
                  }
                >
                  ●
                </span>
              </td>
              <td className="py-2 font-mono">{b.tokenMasked}</td>
              <td className="py-2 space-x-2">
                <button
                  className="text-blue-600"
                  onClick={() => navigate(`/bots/${b.id}`)}
                >
                  Open
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
