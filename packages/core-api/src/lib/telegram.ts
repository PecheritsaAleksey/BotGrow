import crypto from 'crypto';

export type TelegramAuthUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

export function buildCheckString(payload: TelegramAuthUser): string {
  return Object.entries(payload)
    .filter(([k]) => k !== 'hash')
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
}

export function verifyTelegramAuth(
  payload: TelegramAuthUser,
  botToken: string,
  maxAgeSec = 600,
): boolean {
  const checkString = buildCheckString(payload);
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex');
  const hashBuf = Buffer.from(payload.hash, 'hex');
  const hmacBuf = Buffer.from(hmac, 'hex');
  const isValidHash =
    hashBuf.length === hmacBuf.length &&
    crypto.timingSafeEqual(hashBuf, hmacBuf);
  const now = Math.floor(Date.now() / 1000);
  const isFresh = now - payload.auth_date <= maxAgeSec;
  return isValidHash && isFresh;
}

export function toUserUpsert(payload: TelegramAuthUser) {
  return {
    telegramId: payload.id,
    username: payload.username,
    firstName: payload.first_name,
    lastName: payload.last_name,
    photoUrl: payload.photo_url,
  };
}
