import Category from '../model/category';
import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';

interface QueryParams {
    page: number;
    sortBy: string;
    orderBy: string;
    limit?: number;
}

export interface Category<T> {
    id?: number;
    name: string;
    image: File | null | string;
}

const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, 'images');
    },
    filename: function (req: Request, file: any, cb: any) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single('image');

export const getAllCategory = async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response
) => {
    try {
        const {
            page = 0,
            sortBy = 'id',
            orderBy = 'DESC',
            limit = 7,
        }: QueryParams = req.query;
        const offSet = (page - 1) * limit;

        const categories = await Category.findAndCountAll({
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });

        const rowCount = await Category.count();
        const totalPage = Math.ceil(rowCount / limit);

        if (page) {
            res.send({
                totalPage: totalPage,
                data: categories.rows,
            });
        } else {
            res.send({
                data: categories.rows,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

export const create = async (req: Request, res: Response) => {
    upload(req, res, async function () {
        let { name, image }: Category<File> = req.body;

        try {
            await Category.create({
                name: name,
                image: req.file?.filename,
            });

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
        let { name, image }: Category<File | string> = req.body;
        try {
            await Category.update(
                {
                    name: name,
                    image: req.file?.filename,
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
    });
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
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
