import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpires: process.env.JWT_EXPIRES || '7d',
  telegramBotToken: process.env.AUTH_TELEGRAM_BOT_TOKEN,
  devMode:
    process.env.DEV_MODE === 'true' || process.env.NODE_ENV !== 'production',
  devUser: {
    telegramId: Number(process.env.DEV_USER_TELEGRAM_ID || 999999),
    username: process.env.DEV_USER_USERNAME || 'devuser',
    firstName: process.env.DEV_USER_FIRST_NAME || 'Dev',
    lastName: process.env.DEV_USER_LAST_NAME || 'User',
    photoUrl: process.env.DEV_USER_PHOTO_URL,
  },
} as const;

export type Config = typeof config;
