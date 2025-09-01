import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '@/components/Card';
import {
  getBot,
  createBot,
  updateBot,
  deleteBot,
  connectBot,
  disconnectBot,
} from '@/shared/api';
import type { Bot } from '@/shared/types';

export default function BotEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [bot, setBot] = useState<Bot | null>(null);
  const [plainToken, setPlainToken] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
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

  async function handleConnect() {
    if (!bot?.id) return;
    try {
      setIsBusy(true);
      await connectBot(bot.id);
      const fresh = await getBot(bot.id);
      setBot(fresh);
      alert('Webhook connected');
    } catch (e) {
      console.error(e);
      alert('Failed to connect');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDisconnect() {
    if (!bot?.id) return;
    try {
      setIsBusy(true);
      await disconnectBot(bot.id);
      const fresh = await getBot(bot.id);
      setBot(fresh);
      alert('Webhook disconnected');
    } catch (e) {
      console.error(e);
      alert('Failed to disconnect');
    } finally {
      setIsBusy(false);
    }
  }

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
            disabled={isBusy}
          >
            Save
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-1 rounded"
              disabled={isBusy}
            >
              Delete
            </button>
          )}
        </div>
      </form>

      {!isNew && bot && (
        <div className="mt-6 border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Connection</span>
              <span
                className={
                  bot.status === 'connected'
                    ? 'text-green-600'
                    : bot.status === 'error'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }
              >
                {bot.status}
              </span>
            </div>

            <div className="flex gap-2">
              {bot.status !== 'connected' && (
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={handleConnect}
                  disabled={isBusy}
                >
                  {isBusy ? 'Connecting…' : 'Connect'}
                </button>
              )}
              {bot.status === 'connected' && (
                <button
                  type="button"
                  className="bg-yellow-600 text-white px-3 py-1 rounded"
                  onClick={handleDisconnect}
                  disabled={isBusy}
                >
                  {isBusy ? 'Disconnecting…' : 'Disconnect'}
                </button>
              )}
            </div>
          </div>

          {bot.status === 'connected' && bot.webhookUrl && (
            <div className="text-sm">
              <div className="text-gray-500 mb-1">Webhook URL</div>
              <div className="flex items-center gap-2">
                <input
                  className="border p-2 w-full"
                  readOnly
                  value={bot.webhookUrl}
                />
                <button
                  type="button"
                  className="px-2 py-1 border rounded"
                  onClick={() => navigator.clipboard.writeText(bot.webhookUrl!)}
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {bot.status === 'error' && bot.lastError && (
            <div className="bg-red-50 text-red-700 text-sm p-2 rounded">
              {bot.lastError}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
