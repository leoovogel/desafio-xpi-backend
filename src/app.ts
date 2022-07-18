/* istanbul ignore file */
import express from 'express';
import 'express-async-errors';

import errorMiddleware from './middlewares/errorHandler';
import { attachRouters } from './routes';

const app = express();

app.use(express.json());

attachRouters(app);

app.use(errorMiddleware);

export default app;
