import { Router } from 'express';
import { clientsController } from '../controllers';

export default Router()
  .post('/register', clientsController.register)
  .post('/login', clientsController.login);
