import { Router } from 'express';
import * as orderController from '../controller/orderController';
import * as middleware from '../middleware/auth';

const router = Router();
router.post('/create', orderController.create);
router.put('/update/:id', middleware.verifyToken, orderController.update);
router.get('/order-week', middleware.verifyToken, orderController.orderOfWeek);
router.get('/get', middleware.verifyToken, orderController.get);
router.get('/', middleware.verifyToken, orderController.get);

export default router;
