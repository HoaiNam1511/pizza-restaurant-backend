import { Router } from 'express';
import * as middlewareController from '../middleware/auth';
import * as authController from '../auth';
const router = Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPass);
router.post('/logout', middlewareController.verifyToken, authController.logout);
router.get('/confirm', authController.confirmReset);
router.get('/role', authController.getRole);

export default router;
