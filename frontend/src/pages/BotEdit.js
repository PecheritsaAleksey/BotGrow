import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
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
export default function BotEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [bot, setBot] = useState(null);
  const [plainToken, setPlainToken] = useState(null);
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
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
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
  return _jsxs(Card, {
    title: isNew ? 'Create Bot' : 'Edit Bot',
    children: [
      _jsxs('form', {
        className: 'space-y-4',
        onSubmit: handleSubmit,
        children: [
          _jsxs('div', {
            children: [
              _jsx('label', { className: 'block mb-1', children: 'Name *' }),
              _jsx('input', {
                name: 'name',
                className: 'border p-2 w-full',
                value: form.name,
                onChange: handleChange,
                required: true,
              }),
            ],
          }),
          _jsxs('div', {
            children: [
              _jsx('label', {
                className: 'block mb-1',
                children: 'Description',
              }),
              _jsx('textarea', {
                name: 'description',
                className: 'border p-2 w-full',
                value: form.description,
                onChange: handleChange,
              }),
            ],
          }),
          _jsxs('div', {
            children: [
              _jsx('label', { className: 'block mb-1', children: 'Photo URL' }),
              _jsx('input', {
                name: 'photoUrl',
                className: 'border p-2 w-full',
                value: form.photoUrl,
                onChange: handleChange,
              }),
            ],
          }),
          _jsxs('div', {
            children: [
              _jsxs('label', {
                className: 'block mb-1',
                children: [
                  'Bot Token ',
                  isNew ? '*' : '',
                  ' ',
                  _jsx('span', {
                    className: 'text-xs text-gray-500',
                    children: '(we won\u2019t show it again)',
                  }),
                ],
              }),
              _jsx('input', {
                name: 'botToken',
                className: 'border p-2 w-full font-mono',
                value: form.botToken,
                onChange: handleChange,
                placeholder: isNew ? '' : bot?.tokenMasked,
              }),
            ],
          }),
          plainToken &&
            _jsxs('div', {
              className: 'bg-yellow-100 p-2 rounded text-sm',
              children: [
                'Plain token: ',
                _jsx('span', { className: 'font-mono', children: plainToken }),
                _jsx('button', {
                  type: 'button',
                  className: 'ml-2 text-blue-600',
                  onClick: () => navigator.clipboard.writeText(plainToken),
                  children: 'Copy',
                }),
              ],
            }),
          _jsxs('div', {
            className: 'flex gap-2',
            children: [
              _jsx('button', {
                type: 'submit',
                className: 'bg-green-500 text-white px-4 py-1 rounded',
                disabled: isBusy,
                children: 'Save',
              }),
              !isNew &&
                _jsx('button', {
                  type: 'button',
                  onClick: handleDelete,
                  className: 'bg-red-500 text-white px-4 py-1 rounded',
                  disabled: isBusy,
                  children: 'Delete',
                }),
            ],
          }),
        ],
      }),
      !isNew &&
        bot &&
        _jsxs('div', {
          className: 'mt-6 border rounded p-3 space-y-2',
          children: [
            _jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                _jsxs('div', {
                  className: 'flex items-center gap-2',
                  children: [
                    _jsx('span', {
                      className: 'font-semibold',
                      children: 'Connection',
                    }),
                    _jsx('span', {
                      className:
                        bot.status === 'connected'
                          ? 'text-green-600'
                          : bot.status === 'error'
                            ? 'text-red-600'
                            : 'text-gray-600',
                      children: bot.status,
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex gap-2',
                  children: [
                    bot.status !== 'connected' &&
                      _jsx('button', {
                        type: 'button',
                        className: 'bg-blue-600 text-white px-3 py-1 rounded',
                        onClick: handleConnect,
                        disabled: isBusy,
                        children: isBusy ? 'Connecting…' : 'Connect',
                      }),
                    bot.status === 'connected' &&
                      _jsx('button', {
                        type: 'button',
                        className: 'bg-yellow-600 text-white px-3 py-1 rounded',
                        onClick: handleDisconnect,
                        disabled: isBusy,
                        children: isBusy ? 'Disconnecting…' : 'Disconnect',
                      }),
                  ],
                }),
              ],
            }),
            bot.status === 'connected' &&
              bot.webhookUrl &&
              _jsxs('div', {
                className: 'text-sm',
                children: [
                  _jsx('div', {
                    className: 'text-gray-500 mb-1',
                    children: 'Webhook URL',
                  }),
                  _jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      _jsx('input', {
                        className: 'border p-2 w-full',
                        readOnly: true,
                        value: bot.webhookUrl,
                      }),
                      _jsx('button', {
                        type: 'button',
                        className: 'px-2 py-1 border rounded',
                        onClick: () =>
                          navigator.clipboard.writeText(bot.webhookUrl),
                        children: 'Copy',
                      }),
                    ],
                  }),
                ],
              }),
            bot.status === 'error' &&
              bot.lastError &&
              _jsx('div', {
                className: 'bg-red-50 text-red-700 text-sm p-2 rounded',
                children: bot.lastError,
              }),
          ],
        }),
    ],
  });
}
