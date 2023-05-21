import * as bookingController from '../controller/bookingController';
import { Router } from 'express';
import * as middleware from '../middleware';
const router = Router();

router.post('/create', bookingController.create);
router.put(
    '/update/:id',
    middleware.verifyToken,
    bookingController.updateBooking
);
router.get(
    '/booking-week',
    middleware.verifyToken,
    bookingController.bookingOfWeek
);
router.get('/verify', bookingController.verifyBooking);
router.get('/get', middleware.verifyToken, bookingController.getAll);
router.get('/', middleware.verifyToken, bookingController.getAll);

export default router;
