import { z } from 'zod';

export const createBotSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  photoUrl: z.string().url().optional(),
  botToken: z.string().min(20),
});

export const updateBotSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional(),
    photoUrl: z.string().url().optional(),
    botToken: z.string().min(20).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const idParamSchema = z.object({
  id: z.string().uuid(),
});
