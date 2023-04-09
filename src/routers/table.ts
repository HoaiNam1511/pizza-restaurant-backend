import express from 'express';
import { Router } from 'express';
const router = express.Router();
import * as tableController from '../controller/tableController';

router.get('/get', tableController.getAll);
router.get('/', tableController.getAll);

export default router;
