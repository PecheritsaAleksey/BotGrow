import axios from 'axios';
import { useAuth } from '@/store/auth';
import type { Bot } from './types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL,
});

api.interceptors.request.use((config) => {
  const { token } = useAuth.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// POST /auth/telegram
export async function authTelegram(payload: any) {
  const { data } = await api.post('/auth/telegram', payload);
  return data as { token: string; user: any };
}

export async function getBots(): Promise<Bot[]> {
  const { data } = await api.get('/bots');
  return data as Bot[];
}
