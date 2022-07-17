import { Router } from 'express';
import { helloController } from '../controllers';

export default Router().get('/', helloController.index);
