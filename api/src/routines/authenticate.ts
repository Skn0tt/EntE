import User from '../models/User';

const authenticate = async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) return done(null, false);
    if (!user.schema.methods.comparePassword(password)) return done(null, false);

    return done(null, user);
  } catch (err) {
    done(err);
  }
};

export default authenticate;
