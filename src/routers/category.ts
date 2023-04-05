import * as categoryController from '../controller/categoryController';
import { Router } from 'express';

const router = Router();

router.get('/get', categoryController.getAllCategory);
router.post('/create', categoryController.create);
router.put('/update/:id', categoryController.updateProduct);
router.delete('/delete/:id', categoryController.deleteCategory);
router.get('/', categoryController.getAllCategory);

export default router;
