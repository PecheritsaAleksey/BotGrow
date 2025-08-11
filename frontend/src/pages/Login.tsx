import { useEffect, useRef } from 'react';
import { useAuth } from '@/store/auth';
import { authTelegram } from '@/shared/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const login = useAuth((s) => s.login);
  const widgetRef = useRef<HTMLDivElement>(null);

  // global callback: called by Telegram widget
  (window as any).onTelegramAuth = async (user: any) => {
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
    script.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_USERNAME);
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
        <div ref={widgetRef} />
        <p className="text-sm text-gray-500">Login with your Telegram account to continue.</p>
      </div>
    </div>
  );
}
