import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '@/components/Card';
import { getBot, createBot, updateBot, deleteBot } from '@/shared/api';
import type { Bot } from '@/shared/types';

export default function BotEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [bot, setBot] = useState<Bot | null>(null);
  const [plainToken, setPlainToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    photoUrl: '',
    botToken: '',
  });

  useEffect(() => {
    if (!isNew && id) {
      getBot(id).then((b) => {
        setBot(b);
        setForm({
          name: b.name,
          description: b.description || '',
          photoUrl: b.photoUrl || '',
          botToken: '',
        });
      });
    }
  }, [id, isNew]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        const res = await createBot({
          name: form.name,
          description: form.description || undefined,
          photoUrl: form.photoUrl || undefined,
          botToken: form.botToken,
        });
        setPlainToken(res.plainBotToken || null);
        setBot(res.bot);
        navigate(`/bots/${res.bot.id}`, { replace: true });
      } else if (id) {
        const res = await updateBot(id, {
          name: form.name,
          description: form.description || undefined,
          photoUrl: form.photoUrl || undefined,
          botToken: form.botToken || undefined,
        });
        setPlainToken(res.plainBotToken || null);
        setBot(res.bot);
        setForm({ ...form, botToken: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!id || isNew) return;
    if (!confirm('Delete this bot?')) return;
    await deleteBot(id);
    navigate('/bots');
  };

  return (
    <Card title={isNew ? 'Create Bot' : 'Edit Bot'}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Name *</label>
          <input
            name="name"
            className="border p-2 w-full"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            className="border p-2 w-full"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">Photo URL</label>
          <input
            name="photoUrl"
            className="border p-2 w-full"
            value={form.photoUrl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">
            Bot Token {isNew ? '*' : ''}{' '}
            <span className="text-xs text-gray-500">
              (we won’t show it again)
            </span>
          </label>
          <input
            name="botToken"
            className="border p-2 w-full font-mono"
            value={form.botToken}
            onChange={handleChange}
            placeholder={isNew ? '' : bot?.tokenMasked}
          />
        </div>
        {plainToken && (
          <div className="bg-yellow-100 p-2 rounded text-sm">
            Plain token: <span className="font-mono">{plainToken}</span>
            <button
              type="button"
              className="ml-2 text-blue-600"
              onClick={() => navigator.clipboard.writeText(plainToken)}
            >
              Copy
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Save
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
