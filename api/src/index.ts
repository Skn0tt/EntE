import * as express from "express";
import { Request, Response } from "express";
import * as logger from 'morgan'
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';

import authenticate from './routines/authenticate';

import Entries from './routes/entries';
import Slots from './routes/slots';
import Users from './routes/users';

const app = express();

app.set("port", process.env.PORT || 3000);

// Express Setup
app.use(logger('dev'))
app.use(bodyParser.json());
app.use(passport.initialize());

// Authentication
passport.use(new BasicStrategy(authenticate));

// Routes
app.use("/entries", Entries);
app.use("/slots", Slots);
app.use("/users", Users);

app.get("/", (req: Request, res: Response) => {
  res.send("Hallo!").end();
});

app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});
