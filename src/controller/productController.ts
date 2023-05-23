import path from 'path';
import multer from 'multer';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

import Product from '../model/product';
import Category from '../model/category';
import { CategoryProduct } from '../model/relationModel';
import { Query, Params, removeImageCloud } from './index';

interface Filter {
    category: string;
}

export interface Product extends Request {
    id?: number;
    name?: string;
    price?: number;
    material?: string;
    description?: string;
    image?: File | null;
    categories: number[];
}

//Get all product
export const getAll = async (
    req: Request<{}, {}, {}, Query>,
    res: Response
): Promise<void> => {
    try {
        const {
            page = 0,
            sortBy = 'id',
            orderBy = 'DESC',
            limit = 7,
        }: Query = req.query;

        const offSet = (page - 1) * limit;

        const result = await Product.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: 'categories',
                },
            ],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });

        if (page) {
            const allProduct = await Product.count();
            const totalPage = Math.ceil(allProduct / limit);

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

//Search product
export const search = async (
    req: Request<{}, {}, {}, Query>,
    res: Response
): Promise<void> => {
    try {
        const { name }: Query = req.query;
        const result = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`,
                },
            },
            include: [
                {
                    model: Category,
                    as: 'categories',
                },
            ],
            limit: 10,
        });

        res.send({
            data: result,
        });
    } catch (err) {
        console.log(err);
    }
};

//Filter product
export const filterProduct = async (
    req: Request<{}, {}, {}, Filter>,
    res: Response
): Promise<void> => {
    try {
        const { category }: Filter = req.query;
        const productFilter = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'categories',
                    where: {
                        id: category,
                    },
                },
            ],
        });
        res.send({
            data: productFilter,
        });
    } catch (err) {
        console.log(err);
    }
};

//Get one product
export const getOne = async (
    req: Request<Params, {}, {}, {}>,
    res: Response
): Promise<void> => {
    try {
        const { id }: Params = req.params;
        const product = await Product.findOne({
            include: [
                {
                    model: Category,
                    as: 'categories',
                },
            ],
            where: {
                id: id,
            },
        });
        res.send(product);
    } catch (err) {
        console.log(err);
    }
};

//Create product
export const create = async (req: Request, res: Response) => {
    let newProductId: { id: number };
    let { name, price, material, description, image, categories }: Product =
        req.body;
    const categoriesArr = JSON.parse(req.body.categories);

    try {
        await Product.create({
            name: name,
            price: price,
            material: material,
            description: description,
            image: req.file?.path || '',
        });
    } catch (err) {
        console.log(err);
    }

    try {
        newProductId = await Product.findOne({
            attributes: ['id'],
            order: [['id', 'DESC']],
        });
    } catch (err) {
        console.log(err);
    }

    const categoryProductId = categoriesArr.map(
        (value: number, index: number) => ({
            categoryId: value,
            productId: newProductId.id,
        })
    );

    try {
        await CategoryProduct.bulkCreate(categoryProductId);

        res.send({
            message: 'Add product success',
            action: 'add',
        });
    } catch (err) {
        console.log(err);
    }
};

//Update product
export const updateProduct = async (req: Request, res: Response) => {
    // upload(req, res, async function () {
    const { id } = req.params;
    let { name, price, material, description, image, categories }: Product =
        req.body;
    const categoriesArr = JSON.parse(req.body.categories);
    removeImageCloud({ TableRemove: Product, id: id });
    try {
        await Product.update(
            {
                name: name,
                price: price,
                material: material,
                description: description,
                image: req.file?.path,
            },
            {
                where: {
                    id: id,
                },
            }
        );

        await CategoryProduct.destroy({
            where: {
                productId: id,
            },
        });
    } catch (err) {
        console.log(err);
    }

    const categoryProductId = categoriesArr.map(
        (value: number, index: number) => ({
            categoryId: value,
            productId: id,
        })
    );

    try {
        await CategoryProduct.bulkCreate(categoryProductId);
        res.send({
            message: 'Update product success',
            action: 'update',
        });
    } catch (err) {
        console.log(err);
    }
    // });
};

//Delete product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        removeImageCloud({ TableRemove: Product, id: id });
        await CategoryProduct.destroy({
            where: {
                productId: id,
            },
        });

        await Product.destroy({
            where: {
                id: id,
            },
        });

        res.send({
            message: 'Delete product success',
            action: 'delete',
        });
    } catch (err) {
        console.log(err);
    }
};
