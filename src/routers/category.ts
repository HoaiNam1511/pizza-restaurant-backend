import * as categoryController from '../controller/categoryController';
import { Router } from 'express';
import * as middleware from '../middleware';

const router = Router();

router.get('/get', middleware.verifyToken, categoryController.getAllCategory);
router.post('/create', middleware.verifyToken, categoryController.create);
router.put(
    '/update/:id',
    middleware.verifyToken,
    categoryController.updateProduct
);
router.delete(
    '/delete/:id',
    middleware.verifyToken,
    categoryController.deleteCategory
);
router.get('/', middleware.verifyToken, categoryController.getAllCategory);

export default router;
