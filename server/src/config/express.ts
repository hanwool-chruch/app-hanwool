import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import logger from './logger';
import { logs } from './consts';
import errorHandler from '../exception/error-handler';

const app = express();
app.use(morgan(logs, { stream: logger }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(errorHandler);

export default app;
