import { Express } from 'express';
import helloRouter from './hello.router';

const routers = [{ '/': helloRouter }];

export const attachRouters = (app: Express) => {
  routers.forEach((routerObject) => {
    const [path, router] = Object.entries(routerObject)[0];

    app.use(path, router);
  });
};
