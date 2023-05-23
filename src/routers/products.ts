import { Router } from 'express';
import * as productController from '../controller/productController';
import * as middleware from '../middleware/auth';
import uploadCloud from '../middleware/uploadImage';

const router = Router();

router.post(
    '/create',
    middleware.verifyToken,
    uploadCloud.single('image'),
    productController.create
);
router.get('/get', productController.getAll);

router.put(
    '/update/:id',
    middleware.verifyToken,
    uploadCloud.single('image'),
    productController.updateProduct
);
router.delete(
    '/delete/:id',
    middleware.verifyToken,
    productController.deleteProduct
);
router.get('/search', productController.search);
router.get('/filter', productController.filterProduct);
router.get('/get/:id', productController.getOne);
router.get('/:id', productController.getOne);
router.get('/', productController.getAll);

export default router;
