import "reflect-metadata";
import { createConnection } from "typeorm";

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyparser from 'body-parser';

// Routes
import login from './route/login';

const app = express();

// Logging
app.use(morgan('dev'))
app.use(bodyparser.json())

app.use('/login', login);

createConnection().then(async (connection) => {
  app.listen(3000);
}).catch(error => console.log(error));
