import express, { Application} from 'express';
//import * as body from 'body-parser';
import route from './routers/router';
import indexRouter from './routers/index';
export const app: Application = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
//app.use('/', indexRouter);
app.use('/users',route);

let puerto: number = 8081;
app.listen(puerto);
console.log('Server on port', puerto);

