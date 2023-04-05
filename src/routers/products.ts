import express from 'express';
import { Router } from 'express';
const router = express.Router();
import * as productController from '../controller/productController';
import multer from 'multer';

// const router = Router();
const upload = multer({ dest: 'images/' });

router.post('/create', productController.create);
router.get('/get', productController.getAll);
router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);

export default router;
