import { Account } from './../model/account';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
require('dotenv').config();

export const verifyToken = (req: any, res: Response, next: any) => {
    const token: string = req.headers.token;

    if (token) {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_KEY as string,
            (err: any, user: any) => {
                if (err) {
                    res.send('Token is not valid');
                } else {
                    req.user = user;
                    next();
                }
            }
        );
    } else {
        console.log('You need login');
    }
};

export const checkAdminAuth = (req: any, res: Response, next: NextFunction) => {
    if (req.user.role < 2) {
        next();
    } else {
        res.send({
            message: 'This feature only available to Admin account',
            action: 'warning',
        });
    }
};

export const checkLogin = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;
    const id: any = jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string);
    const account = await Account.findOne({
        where: {
            id: id,
        },
    });

    try {
        if (account.id) {
            req.data = account;
            next();
        } else {
            res.send('/login');
        }
    } catch (error) {
        console.log(error);
    }
};
