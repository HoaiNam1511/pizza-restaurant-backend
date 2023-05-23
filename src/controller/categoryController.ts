import { Request, Response } from 'express';

import Category from '../model/category';
import { Query, removeImageCloud } from './index';
export interface Category<T> {
    id?: number;
    name: string;
    image: File | null | string;
}

//Get all category
export const getAllCategory = async (
    req: Request<{}, {}, {}, Query>,
    res: Response
) => {
    try {
        const {
            page = 0,
            sortBy = 'id',
            orderBy = 'DESC',
            limit = 7,
        }: Query = req.query;
        const offSet = (page - 1) * limit;

        const result = await Category.findAndCountAll({
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });

        const totalPage = Math.ceil(result.count / limit);

        if (page) {
            res.send({
                totalPage: totalPage,
                data: result.rows,
            });
        } else {
            res.send({
                data: result.rows,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

//Create new category
export const create = async (req: Request, res: Response) => {
    let { name, image }: Category<File> = req.body;

    try {
        await Category.create({
            name: name,
            image: req.file?.path || '',
        });

        res.send({
            message: 'Add category success',
            action: 'add',
        });
    } catch (err) {
        console.log(err);
    }
};

//Update category
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { name, image }: Category<File | string> = req.body;
    try {
        removeImageCloud({ TableRemove: Category, id: id });
        await Category.update(
            {
                name: name,
                image: req.file?.path || '',
            },
            {
                where: {
                    id: id,
                },
            }
        );

        res.send({
            message: 'Update category success',
            action: 'update',
        });
    } catch (err) {
        console.log(err);
    }
};

//Delete category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        removeImageCloud({ TableRemove: Category, id: id });
        await Category.destroy({
            where: {
                id: id,
            },
        });

        res.send({
            message: 'Delete category success',
            action: 'delete',
        });
    } catch (err) {
        console.log(err);
    }
};
