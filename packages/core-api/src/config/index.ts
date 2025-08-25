export const config = {
  port: Number(process.env.PORT) || 4000,
  devMode:
    process.env.DEV_MODE === 'true' || process.env.NODE_ENV !== 'production',
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpires: process.env.JWT_EXPIRES || '7d',
  telegramBotToken: process.env.AUTH_TELEGRAM_BOT_TOKEN,
};

export default config;
