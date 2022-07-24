/* istanbul ignore file */
import express from 'express';
import 'express-async-errors';
import swagger from 'swagger-ui-express';
import swaggerConfig from './utils/swagger.config.json';

import errorMiddleware from './middlewares/errorHandler';
import { attachRouters } from './routes';

const app = express();

app.use(express.json());

app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));

attachRouters(app);

app.use(errorMiddleware);

export default app;
