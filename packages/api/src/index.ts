import * as express from "express";
import * as morgan from "morgan";
import * as passport from "passport";
import basic from "./authentication/strategies/basic";
import jwt from "./authentication/strategies/jwt";
import * as validator from "express-validator";
import { Promise as BBPromise } from "bluebird";
import * as cors from "cors";
import * as helmet from "helmet";
import * as Raven from "raven";

// Setup
import { checkEmail } from "./helpers/mail";
import setupDB from "ente-db";

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

const production = process.env.NODE_ENV === "production";
const app = express();

app.set("port", process.env.PORT || 3000);
app.disable("etag");

// Raven
const DSN =
  "https://056357657b5f4baf94ca072cda3ba9f8:5eb4639c0dda49f695bda81a23bfcbf0@sentry.io/264890";

if (production) {
  Raven.config(DSN).install();
  app.use(Raven.requestHandler());
}

// Express Setup
app.use(express.json());
app.use(validator());

// Logger
if (production) {
  app.use(morgan("common"));
} else {
  app.use(
    morgan("dev", {
      skip: (_, res) => res.statusCode < 400,
      stream: process.stderr
    })
  );

  app.use(
    morgan("dev", {
      skip: (_, res) => res.statusCode >= 400,
      stream: process.stdout
    })
  );
}

// DB
setupDB({ host: "mysql", password: "root", username: "ente", database: "ente" })
  .then(() => console.log("Established connection to DB."))
  .catch(error => console.error("Couldn't connect to DB!", error));

// Security Measures
if (production) {
  // Helmet
  app.use(helmet());
}

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
app.use(passport.authenticate(["jwt", "basic"], { session: false }));

// Authenticated Routes
app.use("/token", token);
app.use("/entries", entries);
app.use("/slots", slots);
app.use("/users", users);
if (!production) {
  app.use("/dev", dev);
}

// Error Handling
app.use(Raven.errorHandler());
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    sentry: res.sentry
  });
  next();
});

// Cron Jobs
if (production) {
  cron();
}

checkEmail();

app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
