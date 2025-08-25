import crypto from 'crypto';

import { config } from '../config';

const ENC_ALGO = 'aes-256-gcm';

function getKey(): Buffer {
  const key = config.encryptionKey;
  return Buffer.from(key, key.length === 64 ? 'hex' : 'base64');
}

export function encryptToken(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENC_ALGO, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decryptToken(payload: string): string {
  const buf = Buffer.from(payload, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const text = buf.subarray(28);
  const decipher = crypto.createDecipheriv(ENC_ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(text), decipher.final()]);
  return decrypted.toString('utf8');
}

export function maskToken(plain: string): string {
  return plain.replace(/.(?=.{4})/g, '*');
}

export function maskTokenFromLast4(last4: string): string {
  return `********${last4}`;
}

export function hashToken(plain: string): string {
  return crypto.createHash('sha256').update(plain).digest('hex');
}
