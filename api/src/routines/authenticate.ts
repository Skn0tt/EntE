import User, { UserModel } from '../models/User';
import { ROLES } from '../constants';
import { JWT_PAYLOAD } from '../routes/token';

export const basic = async (
  username: string,
  password: string,
  done: (err: Error, user?: any) => void,
) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false);
    }

    const valid = await user.comparePassword(password);
    if (valid) {
      return done(null, user);
    }

    return done(null, false);
  } catch (err) {
    return done(err);
  }
};

const isValid = (user: UserModel, jwt: JWT_PAYLOAD): boolean => user && user.role === jwt.role;

export const jwt = async (jwtPayload: JWT_PAYLOAD, done: (err: Error, user?: any) => void) => {
  try {
    const user = await User.findOne({ username: jwtPayload.username });

    if (!isValid(user, jwtPayload)) {
      return done(new Error('Couldnt find User'));
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
