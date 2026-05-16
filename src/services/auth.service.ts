import { Prisma, User } from '../../generated/prisma/client';
import { publicUserSelect } from '../constants/user.select';
import {
  createUser,
  findUniqueUser,
} from '../repositories/user.repository';
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema';
import AppError from '../utils/appError';
import { signJwt, verifyJwt } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';
import { SignOptions } from 'jsonwebtoken';

const signTokens = (user: Pick<User, 'id'>) => {
  const accessExpiresIn = (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ||
    '15m') as SignOptions['expiresIn'];
  const refreshExpiresIn = (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
    '7d') as SignOptions['expiresIn'];

  const access_token = signJwt(
    { sub: user.id },
    'accessTokenPrivateKey',
    { expiresIn: accessExpiresIn }
  );

  const refresh_token = signJwt(
    { sub: user.id },
    'refreshTokenPrivateKey',
    { expiresIn: refreshExpiresIn }
  );

  return { access_token, refresh_token };
};

export const register = async (input: RegisterUserInput) => {
  const {
    lastName,
    firstName,
    middleName,
    birthDate,
    email,
    password,
    role,
  } = input;

  try {
    const hashedPassword = await hashPassword(password);

    return await createUser(
      {
        lastName,
        firstName,
        middleName,
        birthDate: new Date(birthDate),
        email: email.toLowerCase(),
        password: hashedPassword,
        ...(role !== undefined ? { role } : {}),
      },
      publicUserSelect
    );
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new AppError(409, 'Email already exists');
    }
    throw err;
  }
};

export const login = async ({ email, password }: LoginUserInput) => {
  const user = await findUniqueUser({ email: email.toLowerCase() });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError(400, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new AppError(403, 'Your account has been blocked');
  }

  return signTokens(user);
};

export const refresh = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new AppError(403, 'Could not refresh access token');
  }

  const decoded = verifyJwt<{ sub: string }>(
    refreshToken,
    'refreshTokenPrivateKey'
  );

  if (!decoded) {
    throw new AppError(403, 'Could not refresh access token');
  }

  const user = await findUniqueUser({ id: decoded.sub }, publicUserSelect);

  if (!user || !user.isActive) {
    throw new AppError(403, 'Could not refresh access token');
  }

  const { access_token } = signTokens(user);

  return { access_token };
};

export const getCurrentUser = async (accessToken: string | undefined) => {
  if (!accessToken) {
    throw new AppError(401, 'You are not logged in');
  }

  const decoded = verifyJwt<{ sub: string }>(
    accessToken,
    'accessTokenPrivateKey'
  );

  if (!decoded) {
    throw new AppError(401, 'Invalid token');
  }

  const user = await findUniqueUser({ id: decoded.sub }, publicUserSelect);

  if (!user) {
    throw new AppError(401, 'User no longer exists');
  }

  return user;
};
