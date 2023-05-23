import * as tableController from '../controller/tableController';
import * as middleware from '../middleware';
import { Router } from 'express';

const router = Router();

router.get('/get', tableController.getAll);
router.get('/', tableController.getAll);

export default router;
