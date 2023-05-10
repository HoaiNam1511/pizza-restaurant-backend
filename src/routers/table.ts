import * as tableController from '../controller/tableController';
import * as middleware from '../middleware';
import { Router } from 'express';

const router = Router();

router.get('/get', middleware.verifyToken, tableController.getAll);
router.get('/', middleware.verifyToken, tableController.getAll);

export default router;
