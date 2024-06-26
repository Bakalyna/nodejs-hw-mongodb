import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserModel } from '../db/Contact/user.js';
import { SessionModel } from '../db/Contact/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'This email already in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserModel.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserModel.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found!');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionModel.deleteOne({ userId: user._id });

  const session = createSession();

  return await SessionModel.create({
    userId: user._id,
    ...session,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionModel.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUserToken = async ({ sessionId, refreshToken }) => {
  const session = await SessionModel.findOne({ _id: sessionId, refreshToken });

  if (!session) throw createHttpError(401, 'Session not found!');

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isRefreshTokenExpired)
    throw createHttpError(401, 'Session token expired!');

  const newSession = createSession();

  await SessionModel.deleteOne({ _id: sessionId, refreshToken });

  return await SessionModel.create({ userId: session.userId, ...newSession });
};
