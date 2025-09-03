import { z } from 'zod';

const Env = z.object({
  WEBHOOK_SECRET: z.string().min(8),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export const config = Env.parse({
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});
