import User from '../models/User';
import { ROLES } from '../constants';

export const basic = async (username: string, password: string, done: (err: Error, user?: any) => void) => {
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

interface JWT_Payload {
  username: string;
  role: ROLES;
}

export const jwt = async (jwt_payload: JWT_Payload, done: (err: Error, user?: any) => void) => {
  try {
    const user = await User.findOne({ username: jwt_payload.username });

    if (!user) {
      return done(new Error('Couldnt find User'));
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
