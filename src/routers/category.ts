import { Router } from 'express';
import * as categoryController from '../controller/categoryController';
import * as middleware from '../middleware/auth';
import uploadCloud from '../middleware/uploadImage';

const router = Router();

router.post(
    '/create',
    middleware.verifyToken,
    uploadCloud.single('image'),
    categoryController.create
);
router.put(
    '/update/:id',
    middleware.verifyToken,
    uploadCloud.single('image'),
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
