import { Router } from 'express';
import * as orderController from '../controller/orderController';

const router = Router();
router.post('/create', orderController.create);
router.put('/update/:id', orderController.update);
router.get('/', orderController.get);

export default router;
