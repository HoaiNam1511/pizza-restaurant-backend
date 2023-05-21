import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Token from '../model/token';
import { sendMail } from './../util/mail';
import { Account, Role } from '../model/account';
import { FormEmailForgotPassword } from '../custom/formEmailResetPassword';

interface AccountLogin {
    username: string;
    password: string;
}

interface InfoAccountToken {
    id: number;
    role: number;
    username: string;
}

interface BodyForgotPass {
    email: string;
}

interface BodyResetPass {
    email: string;
    username: string;
    newPassword: string;
}

interface QueryVerify {
    token: string;
}

let refreshTokenArr: string[] = [];

const generateAccessToken = (account: InfoAccountToken) => {
    return jwt.sign(
        {
            id: account.id,
            role: account.role,
            username: account.username,
        },
        process.env.ACCESS_TOKEN_KEY as string,
        { expiresIn: '180s' }
    );
};

const generateRefreshToken = (account: InfoAccountToken) => {
    return jwt.sign(
        {
            id: account.id,
            role: account.role,
            username: account.username,
        },
        process.env.REFRESH_TOKEN_KEY as string,
        { expiresIn: '365d' }
    );
};

export const login = async (
    req: Request<{}, {}, AccountLogin, {}>,
    res: Response
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
                username: account.username,
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

export const refreshToken = async (
    req: Request<{}, {}, {}, {}>,
    res: Response
) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.send('You are not authenticated');
    //Check refresh token
    if (!refreshTokenArr.includes(refreshToken)) {
        return res.send('Refresh token is not valid');
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY as string,
        (err: any, user: any) => {
            if (err) {
                console.log(err);
            }

            const newAccessToken = generateAccessToken(user);
            res.send({
                token: newAccessToken,
            });
        }
    );
};

export const logout = (req: Request<{}, {}, {}, {}>, res: Response) => {
    res.clearCookie('refreshToken');
    refreshTokenArr = refreshTokenArr.filter(
        (token) => token !== req.cookies.refreshToken
    );
    res.send('Logout success');
};

export const getRole = async (req: Request<{}, {}, {}, {}>, res: Response) => {
    try {
        const result = await Role.findAll();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
};

export const forgotPassword = async (
    req: Request<{}, {}, BodyForgotPass, {}>,
    res: Response
) => {
    const { email }: BodyForgotPass = req.body;

    try {
        const result = await Account.findOne({
            attributes: ['email', 'username'],
            where: {
                email: email,
            },
        });

        if (result) {
            res.send({
                data: result,
            });
        } else {
            res.send({
                message: 'Email is not define',
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const resetPass = async (
    req: Request<{}, {}, BodyResetPass, {}>,
    res: Response
) => {
    try {
        const { email, newPassword, username }: BodyResetPass = req.body;
        bcrypt
            .hash(email, parseInt(process.env.BCRYPT_SALT as string))
            .then(async (hashEmail) => {
                await Token.create({
                    email: email,
                    password: newPassword,
                    token: hashEmail,
                });

                const link = `${process.env.APP_URL}/auth/confirm?token=${hashEmail}`;
                sendMail(
                    email,
                    'Reset password',
                    FormEmailForgotPassword({ name: username, href: link })
                );

                res.send({
                    status: true,
                    message:
                        'We received a request to your email, please confirm for change password.',
                    token: hashEmail,
                });
            });
    } catch (err) {
        console.log(err);
    }
};

export const confirmReset = async (
    req: Request<{}, {}, {}, QueryVerify>,
    res: Response
) => {
    const { token }: QueryVerify = req.query;
    try {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
        //Get account info
        const result = await Token.findOne({
            where: {
                [Op.and]: {
                    token: token,
                    created_at: { [Op.gte]: threeMinutesAgo },
                },
            },
        });

        //Token is correct
        if (result) {
            //Delete token token => disable token
            await Token.destroy({
                where: {
                    token: token,
                },
            });

            //Update password
            await Account.update(
                {
                    password: result.password,
                },
                {
                    where: {
                        email: result.email,
                    },
                }
            );
            res.send('Change success');
        } else {
            res.send('Token is not valid');
        }
    } catch (err) {
        console.log(err);
    }
};
