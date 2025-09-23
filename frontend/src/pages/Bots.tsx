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
        <Link to="/bots/new" className="btn-primary">
          Create Bot
        </Link>
      </div>
      <table className="table-base">
        <thead>
          <tr>
            <th className="table-th">Name</th>
            <th className="table-th">Status</th>
            <th className="table-th">Token</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {bots.map((b) => (
            <tr key={b.id} className="table-tr">
              <td className="table-td">{b.name}</td>
              <td className="table-td">
                <span
                  className={
                    b.status === 'connected'
                      ? 'text-success'
                      : b.status === 'error'
                        ? 'text-error'
                        : 'text-text-muted'
                  }
                >
                  ●
                </span>
              </td>
              <td className="table-td font-mono">{b.tokenMasked}</td>
              <td className="table-td space-x-2">
                <button
                  className="btn-ghost text-primary px-2 py-1"
                  onClick={() => navigate(`/bots/${b.id}`)}
                >
                  Open
                </button>
                <button
                  className="btn-ghost text-error px-2 py-1"
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
