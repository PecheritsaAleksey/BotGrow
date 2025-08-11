import { create } from 'zustand';

export type TGUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

type AuthState = {
  token: string | null;
  user: TGUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: TGUser) => void;
  logout: () => void;
};

// simple localStorage helpers
const KEY = 'botgrow_auth';
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
};
const save = (v: any) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
const clear = () => { try { localStorage.removeItem(KEY); } catch {} };

const initial = load();

export const useAuth = create<AuthState>((set) => ({
  token: initial?.token ?? null,
  user: initial?.user ?? null,
  isAuthenticated: Boolean(initial?.token),
  login: (token, user) => {
    save({ token, user });
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    clear();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
