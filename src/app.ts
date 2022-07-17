import express from 'express';
import { attachRouters } from './routes';

const app = express();

app.use(express.json());

attachRouters(app);

export default app;
