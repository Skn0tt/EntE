import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';
import * as mongoose from 'mongoose';

import authenticate from './routines/authenticate';

import entries from './routes/entries';
import slots from './routes/slots';
import users from './routes/users';

// Mongoose
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });


const app = express();

app.set('port', process.env.PORT || 3000);

// Express Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());

// Authentication
passport.use(new BasicStrategy(authenticate));

// Routes
app.use('/entries', entries);
app.use('/slots', slots);
app.use('/users', users);

app.listen(app.get('port'), () => {
  console.log(
    ('  App is running at http://localhost:%d in %s mode'),
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});
