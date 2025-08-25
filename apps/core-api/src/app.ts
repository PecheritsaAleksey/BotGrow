import express from 'express';
import cors from 'cors';

import routes from './routes';
import { errorHandler } from './middlewares/error';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.send('ok'));

app.use(routes);

app.use(errorHandler);

export default app;
