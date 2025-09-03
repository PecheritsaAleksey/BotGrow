import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  const status =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err && typeof (err as any).status === 'number' ? (err as any).status : 500;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = (err as any)?.message || 'Internal Server Error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const code = (err as any)?.code ? String((err as any).code) : undefined;
  res.status(status).json({ message, ...(code ? { code } : {}) });
};
