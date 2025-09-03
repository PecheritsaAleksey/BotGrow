import dotenv from 'dotenv';

import { createApp } from './app';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';
const app = createApp();

app.get('/health', (_req, res) => res.send('ok'));
app.listen(PORT, HOST, () =>
  console.log(`bot-server on http://${HOST}:${PORT}`),
);
