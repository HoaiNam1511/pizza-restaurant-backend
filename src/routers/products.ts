import express from 'express';
import { Router } from 'express';
import * as productController from '../controller/productController';
import multer from 'multer';
import * as middleware from '../middleware';

const router = Router();
const upload = multer({ dest: 'images/' });

router.post('/create', middleware.verifyToken, productController.create);
router.get('/get', productController.getAll);
router.put(
    '/update/:id',
    middleware.verifyToken,
    productController.updateProduct
);
router.delete(
    '/delete/:id',
    middleware.verifyToken,
    productController.deleteProduct
);
router.get('get/:id', productController.getOne);
router.get('/:id', productController.getOne);
router.get('/', productController.filterProduct);
router.get('/', productController.getAll);

export default router;
