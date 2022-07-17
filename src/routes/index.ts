/* istanbul ignore file */
import { Express } from 'express';
import validateBody from '../middlewares/validateBody';
import investmentsRouter from './investments.router';

const routers = [{ '/investments': investmentsRouter }];
const middlewares = [validateBody];

export const attachRouters = (app: Express) => {
  routers.forEach((routerObject) => {
    const [path, router] = Object.entries(routerObject)[0];

    app.use(path, middlewares, router);
  });
};
