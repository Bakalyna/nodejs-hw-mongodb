import createHttpError from 'http-errors';
import { SessionModel } from '../db/Contact/session.js';
import { UserModel } from '../db/Contact/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionModel.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found!'));
    return;
  }
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UserModel.findById(session.userId);
  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }
  req.user = user;
  next();
};
