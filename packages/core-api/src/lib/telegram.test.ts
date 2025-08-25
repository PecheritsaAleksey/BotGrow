import assert from 'assert';
import crypto from 'crypto';

import {
  buildCheckString,
  verifyTelegramAuth,
  TelegramAuthUser,
} from './telegram';

const botToken = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
const base: TelegramAuthUser = {
  id: 1,
  first_name: 'Test',
  auth_date: Math.floor(Date.now() / 1000),
  hash: '',
};
const checkString = buildCheckString(base);
const secret = crypto.createHash('sha256').update(botToken).digest();
const hash = crypto
  .createHmac('sha256', secret)
  .update(checkString)
  .digest('hex');
const payload: TelegramAuthUser = { ...base, hash };

assert.ok(verifyTelegramAuth(payload, botToken));

payload.hash = 'deadbeef';
assert.ok(!verifyTelegramAuth(payload, botToken));

console.log('telegram auth tests passed');
