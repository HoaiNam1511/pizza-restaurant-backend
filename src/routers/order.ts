import { Router } from 'express';
import * as orderController from '../controller/orderController';

const router = Router();
router.get('/', orderController.get);

export default router;
