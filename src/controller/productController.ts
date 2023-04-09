import path from 'path';
import { Request, Response } from 'express';
import Product from '../model/product';
import { CategoryProduct } from '../model/relationModel';
import multer from 'multer';
import Category from '../model/category';
import { QueryParams } from './index';

export interface Product extends Request {
    id?: number;
    name?: string;
    price?: number;
    material?: string;
    description?: string;
    image?: File | null;
    categories: number[];
}

type AsyncFunction<T> = () => Promise<T>;

const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, 'images');
    },
    filename: function (req: Request, file: any, cb: any) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single('image');

export const getAll = async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response
): Promise<void> => {
    try {
        const {
            page = 0,
            sortBy = 'id',
            orderBy = 'DESC',
            limit = 7,
        }: QueryParams = req.query;
        const offSet = (page - 1) * limit;

        const allProduct = await Product.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                },
            ],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });

        const rowCount = await Product.count();
        const totalPage = Math.ceil(rowCount / limit);

        if (page) {
            res.send({
                totalPage: totalPage,
                data: allProduct.rows,
            });
        } else {
            res.send({
                data: allProduct.rows,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

export const create = async (req: Request, res: Response) => {
    upload(req, res, async function () {
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
                image: req.file?.filename,
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
                message: 'Add category success',
                action: 'add',
            });
        } catch (err) {
            console.log(err);
        }
    });
};

export const updateProduct = async (req: Request, res: Response) => {
    upload(req, res, async function () {
        const { id } = req.params;
        let { name, price, material, description, image, categories }: Product =
            req.body;
        const categoriesArr = JSON.parse(req.body.categories);

        try {
            await Product.update(
                {
                    name: name,
                    price: price,
                    material: material,
                    description: description,
                    image: req.file?.filename,
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
                message: 'Update category success',
                action: 'update',
            });
        } catch (err) {
            console.log(err);
        }
    });
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
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
            message: 'Delete category success',
            action: 'delete',
        });
    } catch (err) {
        console.log(err);
    }
};
