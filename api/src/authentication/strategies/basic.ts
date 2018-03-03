import User, { UserModel } from '../../models/User';
import { ROLES } from '../../constants';
import { JWT_PAYLOAD } from '../../routes/token';
import { BasicStrategy } from 'passport-http';

const BasicStrat = new BasicStrategy(async (username, password, done) => {
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
});

export default BasicStrat;
