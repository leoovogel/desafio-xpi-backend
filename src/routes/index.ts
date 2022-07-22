/* istanbul ignore file */
import { Express } from 'express';

import investmentsRouter from './investments.router';
import clientsRouter from './clients.router';
import accountsRouter from './accounts.router';

import validateBody from '../middlewares/validateBody';

const routers = [
  { '/': clientsRouter },
  { '/investments': investmentsRouter },
  { '/account': accountsRouter },
];
const middlewares = [validateBody];

export const attachRouters = (app: Express) => {
  routers.forEach((routerObject) => {
    const [path, router] = Object.entries(routerObject)[0];

    app.use(path, middlewares, router);
  });
};
