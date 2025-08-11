import { useEffect, useState } from 'react';

import Card from '@/components/Card';
import { getBots } from '@/shared/api';
import type { Bot } from '@/shared/types';

export default function Bots() {
  const [bots, setBots] = useState<Bot[]>([]);

  useEffect(() => {
    getBots().then(setBots);
  }, []);

  return (
    <Card title="Bots">
      <ul className="list-disc pl-6 space-y-1">
        {bots.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </Card>
  );
}
