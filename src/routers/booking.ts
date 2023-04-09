import * as bookingController from '../controller/bookingController';
import { Router } from 'express';

const router = Router();

router.post('/create', bookingController.create);
router.put('/update/:id', bookingController.update);
router.get('/get', bookingController.getAll);
router.get('/', bookingController.getAll);

export default router;
