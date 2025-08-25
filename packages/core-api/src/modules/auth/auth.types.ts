import { TelegramAuthUser } from '../../lib/telegram';
export type TelegramAuthBody = TelegramAuthUser;

export interface AuthResult {
  token: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}
