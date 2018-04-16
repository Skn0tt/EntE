import { User } from "ente-db";
import { BasicStrategy } from "passport-http";

const basicStrategy = new BasicStrategy(async (username, password, done) => {
  try {
    const user = await User.checkPassword(username, password);

    return done(null, user || false);
  } catch (error) {
    return done(error, false);
  }
});

export default basicStrategy;
