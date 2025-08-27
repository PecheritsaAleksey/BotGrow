export type { TelegramAuthUser } from '../../lib/telegram';

export interface AuthResult {
  token: string;
  user: {
    id: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    photoUrl?: string | null;
  };
}
