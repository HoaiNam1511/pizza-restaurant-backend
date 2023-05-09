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
        res.send('You need login');
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
