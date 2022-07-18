import { Router } from 'express';
import { investmentsController } from '../controllers';

export default Router()
  .post('/buy', investmentsController.buy);
