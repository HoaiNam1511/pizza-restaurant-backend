import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { Params, Query } from './index';
import { Role, Account_role, Account } from '../model/account';
interface Body {
    email: string;
    username: string;
    password: string;
    status: number;
    role: number;
}
//Get account
export const get = async (req: Request<{}, {}, Body, Query>, res: Response) => {
    const {
        page = 0,
        sortBy = 'id',
        orderBy = 'DESC',
        limit = 7,
    }: Query = req.query;
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

        const totalPage = Math.ceil(result.count / limit);

        res.send({
            totalPage: totalPage,
            data: result.rows,
        });
    } catch (error) {
        console.log(error);
    }
};

//Create account
export const create = async (req: Request<{}, {}, Body, {}>, res: Response) => {
    const { email, username, password, status, role }: Body = req.body;
    let newUser: any, checkAccountAlready: any;
    try {
        checkAccountAlready = await Account.findOne({
            attributes: ['username'],
            where: {
                [Op.and]: { username: username, email: email },
            },
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

//Update account
export const update = async (req: any, res: Response) => {
    const { id }: Params = req.params;
    const { email, username, password, status, role }: Body = req.body;
    const { actionaccount } = req.headers;
    const { username: currentUsername } = req.user;

    try {
        if (actionaccount !== process.env.ACCOUNT_AUTH) {
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
        } else {
            if (currentUsername === process.env.ACCOUNT_AUTH) {
                await Account.update(
                    {
                        password: password,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );
                res.send({
                    message: 'Update success',
                    action: 'update',
                });
            } else {
                res.send({
                    message: 'You are not auth',
                    action: 'warning',
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

//Delete account
export const deleteAccount = async (req: any, res: Response) => {
    const { id }: Params = req.params;
    const { actionaccount } = req.headers;

    try {
        if (actionaccount === process.env.ACCOUNT_AUTH) {
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

            res.send({
                message: 'Delete user success',
                action: 'delete',
            });
        }
    } catch (error) {
        console.log(error);
    }
};
