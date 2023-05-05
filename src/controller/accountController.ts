import { Role, Account_role, Account } from '../model/account';
import { Request, Response, NextFunction } from 'express';

interface Body {
    email: string;
    username: string;
    password: string;
    status: number;
    role: number;
}

interface Params {
    id: number;
}

interface QueryParams {
    page: number;
    sortBy: string;
    orderBy: string;
    limit?: number;
}

export const get = async (
    req: Request<{}, {}, Body, QueryParams>,
    res: Response,
    next: any
) => {
    const {
        page = 0,
        sortBy = 'id',
        orderBy = 'DESC',
        limit = 7,
    }: QueryParams = req.query;
    const offSet = (page - 1) * limit;
    try {
        const result = await Account.findAndCountAll({
            attributes: ['id', 'email', 'username', 'password', 'status'],
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name', 'description'],
                    as: 'role',
                    through: { attributes: [] },
                },
            ],
            required: false,
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });

        res.send({
            data: result.rows,
        });
    } catch (error) {
        console.log(error);
    }
};

export const create = async (
    req: Request<{}, {}, Body, {}>,
    res: Response,
    next: NextFunction
) => {
    const { email, username, password, status, role }: Body = req.body;
    let newUser: any, checkAccountAlready: any;
    try {
        checkAccountAlready = await Account.findOne({
            attributes: ['username'],
            where: { username: username },
        });

        //user already
        if (checkAccountAlready) {
            res.send({
                message: 'Username had been already',
                action: 'warning',
            });
        } else {
            //create new user
            await Account.create({
                email: email,
                username: username,
                password: password,
                status: status,
            });

            //get new id user recent create
            newUser = await Account.findOne({
                attributes: ['id'],
                order: [['id', 'DESC']],
            });

            //add role
            await Account_role.create({
                accountId: newUser.id,
                roleId: role,
            });
            res.send({
                message: 'Add account success',
                action: 'add',
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const update = async (
    req: Request<Params, {}, Body, {}>,
    res: Response,
    next: NextFunction
) => {
    const { id }: Params = req.params;
    const { email, username, password, status, role }: Body = req.body;
    console.log('come update');
    try {
        await Account.update(
            {
                email: email,
                user_name: username,
                password: password,
                status: status,
            },
            {
                where: {
                    id: id,
                },
            }
        );

        await Account_role.update(
            {
                roleId: role,
            },
            {
                where: {
                    accountId: id,
                },
            }
        );
        res.send({
            message: 'Update user success',
            action: 'update',
        });
    } catch (error) {
        console.log(error);
    }
};

export const deleteAccount = async (req: any, res: Response, next: any) => {
    const { id }: Params = req.params;
    const { name } = req.headers;
    try {
        if (name === 'admin') {
            res.send({
                message: 'You cannot delete this user',
                action: 'warning',
            });
        } else {
            await Account.destroy({
                where: {
                    id: id,
                },
            });

            await Account_role.destroy({
                where: {
                    accountId: id,
                },
            });
            res.send({
                message: 'Delete user success',
                action: 'delete',
            });
        }
    } catch (error) {
        console.log(error);
    }
};
