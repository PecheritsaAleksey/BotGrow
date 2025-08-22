import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/store/auth';
import { authTelegram, devLogin } from '@/shared/api';

export type TelegramAuthUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

type TGWindow = Window &
  typeof globalThis & {
    onTelegramAuth?: (user: TelegramAuthUser) => Promise<void>;
  };

export default function Login() {
  const nav = useNavigate();
  const login = useAuth((s) => s.login);
  const widgetRef = useRef<HTMLDivElement>(null);
  const showDev =
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true';

  // global callback: called by Telegram widget
  (window as TGWindow).onTelegramAuth = async (user: TelegramAuthUser) => {
    try {
      const res = await authTelegram(user);
      login(res.token, res.user);
      nav('/', { replace: true });
    } catch (e: unknown) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 rounded-2xl shadow bg-white space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Sign in to BotGrow</h1>
        <div ref={widgetRef} className="flex justify-center" />
        {showDev && (
          <button
            type="button"
            className="w-full bg-gray-200 text-gray-700 py-2 rounded"
            onClick={async () => {
              try {
                const res = await devLogin();
                login(res.token, res.user);
                nav('/', { replace: true });
              } catch (e) {
                console.error('Dev login failed', e);
                alert('Dev login failed');
              }
            }}
          >
            Login as Demo User
          </button>
        )}
        <p className="text-sm text-gray-500">
          Login with your Telegram account to continue.
        </p>
      </div>
    </div>
  );
}
