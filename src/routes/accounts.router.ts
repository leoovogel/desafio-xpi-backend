/* istanbul ignore file */
import { Router } from 'express';
import { accountsController } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';
import updateBalanceAndInvestments from '../middlewares/updateBalanceAndInvestments';

export default Router()
  .use(authMiddleware, updateBalanceAndInvestments)
  .post('/deposit', accountsController.deposit)
  .post('/withdrawal', accountsController.withdrawal)
  .get('/balance', accountsController.getBalance)
  .get('/assets', accountsController.getAssets)
  .get('/transactions-statement', accountsController.getTransactionsStatement);
