import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import logger from './logger';
import { logs } from './consts';
import errorHandler from '../exception/error-handler';
import passport from 'passport';
import strategies from '../modules/auth/passport';
import { authRouter, userRouter } from '../router';

const app = express();
app.use(morgan(logs, { stream: logger }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use(passport.initialize());
passport.use(strategies.jwt);
passport.use(strategies.google);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(compression());
app.use(errorHandler);

export default app;
