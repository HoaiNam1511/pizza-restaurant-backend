import express from 'express';
import { Router } from 'express';
import * as accountController from '../controller/accountController';
import * as middleware from '../middleware';

const router = Router();

router.post(
    '/create',
    middleware.verifyToken,
    middleware.checkAdminRole,
    accountController.create
);

router.put(
    '/update/:id',
    middleware.verifyToken,
    middleware.checkAdminRole,
    accountController.update
);

router.delete(
    '/delete/:id',
    middleware.verifyToken,
    middleware.checkAdminRole,
    accountController.deleteAccount
);
router.get(
    '/get',
    middleware.verifyToken,
    middleware.checkAdminRole,
    accountController.get
);
router.get(
    '/',
    middleware.verifyToken,
    middleware.checkAdminRole,
    accountController.get
);

export default router;
