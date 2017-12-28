import User from '../models/User';

const authenticate = async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false);

    const valid = await user.comparePassword(password);

    if (valid) {
      await user.populate('children');
      return done(null, user);
    }
    
    return done(null, false);
  } catch (err) {
    return done(err);
  }
};

export default authenticate;
