import * as bookingController from '../controller/authController';
import { Router } from 'express';
import * as middlewareController from '../controller/middlewareController';
import * as authController from '../controller/authController';
const router = Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/role', authController.getRole);
router.post('/logout', middlewareController.verifyToken, authController.logout);

export default router;
