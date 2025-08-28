import axios from 'axios';

import type {
  Bot,
  BotWithToken,
  CreateBotInput,
  UpdateBotInput,
} from './types';

import type { TGUser } from '@/store/auth';
import { useAuth } from '@/store/auth';
import type { TelegramAuthUser } from '@/pages/Login';

export const api = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL,
});

api.interceptors.request.use((config) => {
  const { token } = useAuth.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// POST /auth/telegram
export async function authTelegram(payload: TelegramAuthUser) {
  const { data } = await api.post('/auth/telegram', payload);
  return data as { token: string; user: TGUser };
}

export async function devLogin() {
  const { data } = await api.post('/auth/dev-login');
  return data as { token: string; user: TGUser };
}

export async function listBots(): Promise<Bot[]> {
  const { data } = await api.get('/bots');
  return data.bots as Bot[];
}

export async function getBot(id: string): Promise<Bot> {
  const { data } = await api.get(`/bots/${id}`);
  return data.bot as Bot;
}

export async function createBot(
  payload: CreateBotInput,
): Promise<BotWithToken> {
  const { data } = await api.post('/bots', payload);
  return data as BotWithToken;
}

export async function updateBot(
  id: string,
  payload: UpdateBotInput,
): Promise<BotWithToken> {
  const { data } = await api.put(`/bots/${id}`, payload);
  return data as BotWithToken;
}

export async function deleteBot(id: string): Promise<void> {
  await api.delete(`/bots/${id}`);
}
