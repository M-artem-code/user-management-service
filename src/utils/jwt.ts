import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (
  payload: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options: SignOptions
) => {
  const secret =
    keyName === 'accessTokenPrivateKey'
      ? process.env.JWT_ACCESS_TOKEN_SECRET!
      : process.env.JWT_REFRESH_TOKEN_SECRET!;

  return jwt.sign(payload, secret, options);
};

export const verifyJwt = <T>(
  token: string,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey'
): T | null => {
  try {
    const secret =
      keyName === 'accessTokenPrivateKey'
        ? process.env.JWT_ACCESS_TOKEN_SECRET!
        : process.env.JWT_REFRESH_TOKEN_SECRET!;

    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
};