import { Express } from 'express';
import validateBody from '../middlewares/validateBody';
import helloRouter from './hello.router';

const routers = [{ '/': helloRouter }];
const middlewares = [validateBody];

export const attachRouters = (app: Express) => {
  routers.forEach((routerObject) => {
    const [path, router] = Object.entries(routerObject)[0];

    app.use(path, middlewares, router);
  });
};
