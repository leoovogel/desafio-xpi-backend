/* istanbul ignore file */
import { Router } from 'express';
import { assetsController } from '../controllers';

export default Router()
  .get('/:id', assetsController.getById)
  .get('/', assetsController.getAll);
