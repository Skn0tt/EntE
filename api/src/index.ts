import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';
import * as mongoose from 'mongoose';
import * as validator from 'express-validator';
import { Promise } from 'bluebird';
import * as cors from 'cors';
import * as helmet from 'helmet';

// Routines
import authenticate from './routines/authenticate';

// Routes
import entries from './routes/entries';
import slots from './routes/slots';
import users from './routes/users';
import login from './routes/login';

const production = process.env.NODE_ENV === 'production';

// Mongoose
require('mongoose').Promise = Promise;
mongoose.connect(
  production ? 'mongodb://mongodb' : 'mongodb://localhost/entschuldigungsVerfahrentTest',
  { useMongoClient: true },
);

const app = express();

app.set('port', process.env.PORT || 4000);
app.disable('etag');

// Express Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(validator());

// Security Measures
if (production) {
  // Helmet
  app.use(helmet());
}

// Cors
app.use(cors({ origin: true }));
app.options('*', cors({ origin: true }));

// Authentication
app.use(passport.initialize());
passport.use(new BasicStrategy(authenticate));
app.use(passport.authenticate('basic', { session: false }));

// Routes
app.use('/entries', entries);
app.use('/slots', slots);
app.use('/users', users);
app.use('/login', login);

app.listen(app.get('port'), () => {
  console.log(
    ('  App is running at http://localhost:%d in %s mode'),
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});
