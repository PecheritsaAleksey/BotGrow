import jwt from 'jsonwebtoken';

export function signJwt(
  payload: object,
  secret: string,
  expiresIn: string,
): string {
  return jwt.sign(
    payload,
    secret as jwt.Secret,
    { expiresIn } as jwt.SignOptions,
  );
}

export function verifyJwt<T>(token: string, secret: string): T {
  return jwt.verify(token, secret as jwt.Secret) as T;
}
