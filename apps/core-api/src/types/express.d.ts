declare namespace Express {
  interface UserPayload {
    id: string;
    telegramId?: number;
    username?: string;
  }
  interface Request {
    user?: UserPayload;
  }
}
