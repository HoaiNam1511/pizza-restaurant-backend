import * as tableController from '../controller/tableController';
import { Router } from 'express';

const router = Router();

router.get('/get', tableController.getAll);
router.get('/', tableController.getAll);

export default router;
