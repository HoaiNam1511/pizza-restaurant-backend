import { Router } from 'express';
import * as categoryController from '../controller/categoryController';
import * as middleware from '../middleware';

const router = Router();

router.post('/create', middleware.verifyToken, categoryController.create);
router.put(
    '/update/:id',
    middleware.verifyToken,
    categoryController.updateCategory
);
router.delete(
    '/delete/:id',
    middleware.verifyToken,
    categoryController.deleteCategory
);
router.get('/get', categoryController.getAllCategory);
router.get('/', categoryController.getAllCategory);

export default router;
