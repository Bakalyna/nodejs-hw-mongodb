import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserModel } from '../db/Contact/user.js';
import { SessionModel } from '../db/Contact/session.js';
import {
  FIFTEEN_MINUTES,
  SMTP,
  THIRTY_DAYS,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { randomBytes } from 'crypto';
import checkEnv from '../utils/env.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'node:fs/promises';


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

export const requestResetToken = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    checkEnv('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${checkEnv('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
  });
  
  try {
    await sendEmail({
      from: checkEnv(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );

    throw error;
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = await jwt.verify(payload.token, checkEnv('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await UserModel.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) throw createHttpError(404, 'User not found!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserModel.updateOne({ _id: user._id }, { password: encryptedPassword });

  await SessionModel.deleteOne({ _id: user._id });
};

