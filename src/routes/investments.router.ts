import { Router } from 'express';
import { investmentsController } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';

export default Router()
  .use(authMiddleware)
  .post('/buy', investmentsController.buy)
  .post('/sell', investmentsController.sell);
