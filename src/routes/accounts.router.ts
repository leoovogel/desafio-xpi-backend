/* istanbul ignore file */
import { Router } from 'express';
import { accountsController } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';

export default Router()
  .use(authMiddleware)
  .post('/deposit', accountsController.deposit)
  .post('/withdrawal', accountsController.withdrawal);
