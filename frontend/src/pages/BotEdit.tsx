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
  // creation form (used only for isNew)
  const [form, setForm] = useState({
    name: '',
    description: '',
    photoUrl: '',
    botToken: '',
  });

  // local-only settings state
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [enableBroadcasts, setEnableBroadcasts] = useState(false);

  // edit modal state (for existing bot basic info)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    photoUrl: '',
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
        setEditForm({
          name: b.name,
          description: b.description || '',
          photoUrl: b.photoUrl || '',
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
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  };

  // update only the bot token (existing bot)
  const handleUpdateToken = async () => {
    if (!id || !form.botToken) return;
    try {
      const res = await updateBot(id, { botToken: form.botToken });
      setPlainToken(res.plainBotToken || null);
      setBot(res.bot);
      setForm((prev) => ({ ...prev, botToken: '' }));
    } catch (err) {
      console.error(err);
      alert('Failed to update token');
    }
  };

  // save changes from the edit modal (name/description/photoUrl)
  const handleSaveEdit = async () => {
    if (!id) return;
    try {
      const res = await updateBot(id, {
        name: editForm.name,
        description: editForm.description || undefined,
        photoUrl: editForm.photoUrl || undefined,
      });
      setBot(res.bot);
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save changes');
    }
  };

  const setEditOpen = (open: boolean) => {
    if (open && bot) {
      setEditForm({
        name: bot.name,
        description: bot.description || '',
        photoUrl: bot.photoUrl || '',
      });
    }
    setIsEditOpen(open);
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
      {isNew ? (
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
              Bot Token *{' '}
              <span className="text-xs text-gray-500">
                (we won’t show it again)
              </span>
            </label>
            <input
              name="botToken"
              className="border p-2 w-full font-mono"
              value={form.botToken}
              onChange={handleChange}
              required
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
            <button
              type="button"
              onClick={() => navigate('/bots')}
              className="border px-4 py-1 rounded"
              disabled={isBusy}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        bot && (
          <div className="space-y-6">
            {/* Basic info read-only with Edit button */}
            <div className="border rounded p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="text-lg font-medium">{bot.name}</div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 rounded border"
                  onClick={() => setEditOpen(true)}
                >
                  Edit
                </button>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-500">Description</div>
                <div className="whitespace-pre-wrap">
                  {bot.description || <span className="text-gray-400">—</span>}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-500">Photo URL</div>
                <div className="break-all">
                  {bot.photoUrl || <span className="text-gray-400">—</span>}
                </div>
              </div>
            </div>

            {/* Bot Token updater */}
            <div className="border rounded p-3 space-y-2">
              <div className="text-sm text-gray-500">Bot Token</div>
              <input
                name="botToken"
                className="border p-2 w-full font-mono"
                value={form.botToken}
                onChange={handleChange}
                placeholder={bot.tokenMasked}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={handleUpdateToken}
                  disabled={isBusy || !form.botToken}
                >
                  Update Token
                </button>
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
              </div>
            </div>

            {/* Connection block (unchanged) */}
            <div className="border rounded p-3 space-y-2">
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
                      onClick={() =>
                        navigator.clipboard.writeText(bot.webhookUrl!)
                      }
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

            {/* Bot Settings (local only) */}
            <div className="border rounded p-3 space-y-4">
              <div className="text-lg font-semibold">Bot Settings</div>
              <div>
                <label className="block mb-1">Welcome Message</label>
                <input
                  className="border p-2 w-full"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Welcome to our bot!"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm">Enable Broadcasts</label>
                <input
                  type="checkbox"
                  checked={enableBroadcasts}
                  onChange={(e) => setEnableBroadcasts(e.target.checked)}
                />
              </div>
              <div className="text-xs text-gray-500">
                Changes are local only for now.
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="border px-3 py-1 rounded"
                  onClick={() => {
                    setWelcomeMessage('');
                    setEnableBroadcasts(false);
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="bg-gray-800 text-white px-3 py-1 rounded"
                  onClick={() => alert('Settings saved locally')}
                >
                  Save (Local)
                </button>
              </div>
            </div>

            {/* Danger zone */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-1 rounded"
                disabled={isBusy}
              >
                Delete Bot
              </button>
            </div>
          </div>
        )
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-xl w-full max-w-lg p-4">
            <div className="text-lg font-semibold mb-2">Edit Bot</div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1">Name *</label>
                <input
                  className="border p-2 w-full"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  className="border p-2 w-full"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Photo URL</label>
                <input
                  className="border p-2 w-full"
                  value={editForm.photoUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, photoUrl: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="border px-3 py-1 rounded"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
