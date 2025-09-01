import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { authTelegram, devLogin } from '@/shared/api';
export default function Login() {
  const nav = useNavigate();
  const login = useAuth((s) => s.login);
  const widgetRef = useRef(null);
  const showDev =
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true';
  // global callback: called by Telegram widget
  window.onTelegramAuth = async (user) => {
    try {
      const res = await authTelegram(user);
      login(res.token, res.user);
      nav('/', { replace: true });
    } catch (e) {
      console.error('Auth failed', e);
      alert('Authentication failed');
    }
  };
  useEffect(() => {
    // inject script dynamically
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute(
      'data-telegram-login',
      import.meta.env.VITE_AUTH_TELEGRAM_BOT_USERNAME,
    );
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    widgetRef.current?.appendChild(script);
    return () => {
      if (widgetRef.current) widgetRef.current.innerHTML = '';
    };
  }, []);
  return _jsx('div', {
    className: 'min-h-screen flex items-center justify-center bg-gray-50',
    children: _jsxs('div', {
      className: 'p-8 rounded-2xl shadow bg-white space-y-4 text-center',
      children: [
        _jsx('h1', {
          className: 'text-2xl font-semibold',
          children: 'Sign in to BotGrow',
        }),
        _jsx('div', { ref: widgetRef, className: 'flex justify-center' }),
        showDev &&
          _jsx('button', {
            type: 'button',
            className: 'w-full bg-gray-200 text-gray-700 py-2 rounded',
            onClick: async () => {
              try {
                const res = await devLogin();
                login(res.token, res.user);
                nav('/', { replace: true });
              } catch (e) {
                console.error('Dev login failed', e);
                alert('Dev login failed');
              }
            },
            children: 'Login as Demo User',
          }),
        _jsx('p', {
          className: 'text-sm text-gray-500',
          children: 'Login with your Telegram account to continue.',
        }),
      ],
    }),
  });
}
