/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as express from "express";
import * as morgan from "morgan";
import * as passport from "passport";
import basic from "./authentication/strategies/basic";
import jwt from "./authentication/strategies/jwt";
import * as validator from "express-validator";
import * as cors from "cors";
import * as helmet from "helmet";
import * as Raven from "raven";

// Setup
import setupDB from "ente-db";
import config from "./helpers/config";

// Routines
import cron from "./routines/cron";

// Routes
import auth from "./routes/auth";
import entries from "./routes/entries";
import slots from "./routes/slots";
import users from "./routes/users";
import status from "./routes/status";
import dev from "./routes/dev";
import token from "./routes/token";
import { IUser } from "ente-types";
import logger from "./helpers/logger";

const conf = config.getConfig();

const app = express();

app.set("port", 3000);
app.disable("etag");

const DSN = conf.DSN;

if (!!DSN) {
  Raven.config(DSN).install();
  app.use(Raven.requestHandler());
}

// Express Setup
app.use(express.json());
app.use(validator());

// Logger
app.use(
  morgan("combined", {
    stream: {
      write: logger.info
    }
  })
);

// DB
setupDB(conf.db)
  .then(() => logger.info("Established connection to DB."))
  .catch(error => {
    logger.error("Couldn't connect to DB!", error);
    process.exit(1);
  });
app.use(helmet());

// Cors
app.use(cors({ origin: true }));
app.options("*", cors({ origin: true }));

// Unauthenticated Routes
app.use("/auth", auth);
app.use("/status", status);

// Authentication
app.use(passport.initialize());
passport.use("jwt", jwt);
passport.use("basic", basic);
app.use((req, res, next) => {
  passport.authenticate(
    ["jwt", "basic"],
    { session: false },
    (err: Error, user?: IUser) => {
      if (!!err) {
        return next(err);
      }

      if (!user) {
        return res.send(401);
      }

      req.user = user;

      next();
    }
  )(req, res, next);
});

// Authenticated Routes
app.use("/token", token);
app.use("/entries", entries);
app.use("/slots", slots);
app.use("/users", users);
if (!conf.production) {
  app.use("/dev", dev);
}

// Error Handling
if (!!DSN) {
  app.use(Raven.errorHandler());
}
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({
      error: err.message,
      sentry: res.sentry
    });
    next();
  }
);

// Cron Jobs
if (conf.production) {
  cron();
}

app.listen(app.get("port"), () => {
  logger.info(
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
});
