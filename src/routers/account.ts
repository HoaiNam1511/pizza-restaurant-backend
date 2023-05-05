import express from 'express';
const router = express.Router();
import * as accountController from '../controller/accountController';
import * as middlewareController from '../controller/middlewareController';

router.post(
    '/create',
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    accountController.create
);

router.put(
    '/update/:id',
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    accountController.update
);

router.delete(
    '/delete/:id',
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    accountController.deleteAccount
);
router.get(
    '/get',
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    accountController.get
);
router.get(
    '/',
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    accountController.get
);

export default router;
