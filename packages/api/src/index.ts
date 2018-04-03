import * as express from "express";
import * as logger from "morgan";
import * as passport from "passport";
import * as mongoose from "mongoose";
import basic from "./authentication/strategies/basic";
import jwt from "./authentication/strategies/jwt";
import * as validator from "express-validator";
import { Promise as BBPromise } from "bluebird";
import * as cors from "cors";
import * as helmet from "helmet";
import * as Raven from "raven";

// Setup
import { checkEmail } from "./helpers/mail";

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

const jwtSecret = process.env.JWT_SECRET;
const production = process.env.NODE_ENV === "production";
const app = express();

app.set("port", process.env.PORT || 3000);
app.disable("etag");

// Raven
const DSN =
  "https://056357657b5f4baf94ca072cda3ba9f8:5eb4639c0dda49f695bda81a23bfcbf0@sentry.io/264890";

Raven.config(DSN).install();

// Express Setup
app.use(Raven.requestHandler());
app.use(logger("dev"));
app.use(express.json());
app.use(validator());

const mongoAddress = "mongodb://mongodb/ente";

// Mongoose
require("mongoose").Promise = BBPromise;
mongoose.connect(mongoAddress, { useMongoClient: true });

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
