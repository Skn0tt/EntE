import * as express from 'express';
import * as logger from 'morgan';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';
import * as mongoose from 'mongoose';
import * as validator from 'express-validator';
import { Promise as BBPromise } from 'bluebird';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as Raven from 'raven';

// Routines
import authenticate from './routines/authenticate';

// Routes
import auth from './routes/auth';
import entries from './routes/entries';
import slots from './routes/slots';
import users from './routes/users';
import login from './routes/login';
import status from './routes/status';
import dev from './routes/dev';
import cron from './routines/cron';

const production = process.env.NODE_ENV === 'production';
const kubernetes = process.env.KUBERNETES === 'true';
const app = express();

app.set('port', process.env.PORT || 80);
app.disable('etag');

// Raven
const DSN =
  'https://056357657b5f4baf94ca072cda3ba9f8:5eb4639c0dda49f695bda81a23bfcbf0@sentry.io/264890';

Raven.config(DSN).install();

// Express Setup
app.use(Raven.requestHandler());
app.use(logger('dev'));
app.use(express.json());
app.use(validator());

const mongoAddress =
  kubernetes
    ? 'mongodb://localhost/ev'
    : 'mongodb://mongodb/ev';

// Mongoose
require('mongoose').Promise = BBPromise;
mongoose.connect(mongoAddress, { useMongoClient: true });

// Security Measures
if (production) {
  // Helmet
  app.use(helmet());
}

// Cors
app.use(cors({ origin: true }));
app.options('*', cors({ origin: true }));

// Unauthenticated Routes
app.use('/auth', auth);
app.use('/status', status);

// Authentication
app.use(passport.initialize());
passport.use(new BasicStrategy(authenticate));
app.use(passport.authenticate('basic', { session: false }));

// Authenticated Routes
app.use('/entries', entries);
app.use('/slots', slots);
app.use('/users', users);
app.use('/login', login);
if (!production) { app.use('/dev', dev); }

// Error Handling
app.use(Raven.errorHandler());
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    sentry: res.sentry,
  });
  next();
});

// Cron Jobs
if (production) { cron(); }

app.listen(app.get('port'), () => {
  console.log(
    ('  App is running at http://localhost:%d in %s mode'),
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});
