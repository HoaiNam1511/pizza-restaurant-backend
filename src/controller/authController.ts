import jwt from 'jsonwebtoken';
import { Account, Account_role, Role } from '../model/account';
import { Request, Response, NextFunction } from 'express';
import { Params } from '.';

const secretKey = '15112001';
const refreshTokenKey = '15112001';

interface AccountLogin {
    username: string;
    password: string;
}

interface InfoAccountToken {
    id: number;
    role: number;
}

let refreshTokenArr: string[] = [];

const generateAccessToken = (account: InfoAccountToken) => {
    return jwt.sign(
        {
            id: account.id,
            role: account.role,
        },
        secretKey,
        { expiresIn: '180s' }
    );
};

const generateRefreshToken = (account: InfoAccountToken) => {
    return jwt.sign(
        {
            id: account.id,
            role: account.role,
        },
        refreshTokenKey,
        { expiresIn: '365d' }
    );
};

export const login = async (
    req: Request<{}, {}, AccountLogin, {}>,
    res: Response,
    next: NextFunction
) => {
    const { username, password }: AccountLogin = req.body;
    try {
        let message, accessToken, refreshToken, action;
        const account = await Account.findOne({
            attributes: ['id', 'email', 'username', 'status'],
            where: {
                username: username,
                password: password,
            },
            include: [
                {
                    model: Role,
                    as: 'role',
                },
            ],
        });

        if (account) {
            const accountCookies: InfoAccountToken = {
                id: account.id,
                role: account.role[0].id,
            };
            //Account is active
            if (account.status === true) {
                accessToken = generateAccessToken(accountCookies);
                refreshToken = generateRefreshToken(accountCookies);
                refreshTokenArr.push(refreshToken);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                message = 'Login success';
                action = 'success';
            } else {
                message =
                    'Your account has been disable, please contact admin to active';
                action = 'warning';
            }
        } else {
            message = 'Your email or password is not correct';
            action = 'error';
        }
        res.send({
            data: {
                account,
                token: accessToken,
                message,
                action,
            },
        });
    } catch (err) {
        console.log(err);
    }
};

export const refreshToken = (
    req: Request<{}, {}, AccountLogin, {}>,
    res: Response,
    next: any
) => {
    // Get refresh token from cookies
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.send('You are not authenticated');
    //Check refresh token
    if (!refreshTokenArr.includes(refreshToken)) {
        return res.send('Refresh token is not valid');
    }
    jwt.verify(refreshToken, refreshTokenKey, (err: any, user: any) => {
        if (err) {
            console.log(err);
        }
        refreshTokenArr = refreshTokenArr.filter(
            (token) => token !== refreshToken
        );
        let newAccessToken = generateAccessToken(user);
        let newRefreshToken = generateRefreshToken(user);
        refreshTokenArr.push(newRefreshToken);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            //When deploy change: true
            secure: false,
            path: '/',
            sameSite: 'strict',
        });
        res.send({
            token: newAccessToken,
        });
    });
};

export const checkLogin = async (req: any, res: Response, next: any) => {
    const token = req.cookies?.token;
    const id: any = jwt.verify(token, secretKey);
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

export const logout = (
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: any
) => {
    res.clearCookie('refreshToken');
    refreshTokenArr = refreshTokenArr.filter(
        (token) => token !== req.cookies.refreshToken
    );
    res.send('Logout success');
};

export const getRole = async (
    req: Request<{}, {}, AccountLogin, {}>,
    res: Response,
    next: any
) => {
    try {
        const result = await Role.findAll();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
};
