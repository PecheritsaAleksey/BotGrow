import axios from 'axios';
import { useAuth } from '@/store/auth';
export const api = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL,
});
api.interceptors.request.use((config) => {
  const { token } = useAuth.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// POST /auth/telegram
export async function authTelegram(payload) {
  const { data } = await api.post('/auth/telegram', payload);
  return data;
}
export async function devLogin() {
  const { data } = await api.post('/auth/dev-login');
  return data;
}
export async function listBots() {
  const { data } = await api.get('/bots');
  return data.bots;
}
export async function getBot(id) {
  const { data } = await api.get(`/bots/${id}`);
  return data.bot;
}
export async function createBot(payload) {
  const { data } = await api.post('/bots', payload);
  return data;
}
export async function updateBot(id, payload) {
  const { data } = await api.put(`/bots/${id}`, payload);
  return data;
}
export async function deleteBot(id) {
  await api.delete(`/bots/${id}`);
}
export async function connectBot(id) {
  const { data } = await api.post(`/bots/${id}/connect`);
  return data;
}
export async function disconnectBot(id) {
  const { data } = await api.post(`/bots/${id}/disconnect`);
  return data;
}
