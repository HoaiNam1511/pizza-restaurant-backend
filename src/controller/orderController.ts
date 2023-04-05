import { Order, Customer, OrderDetail } from '../model/order';
import { Request, Response } from 'express';
import Product from '../model/product';

export const get = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await Order.findAll({
            include: [
                {
                    model: Customer,
                },
                {
                    model: Product,
                    as: 'products',
                },
            ],
        });
        res.send(response);
    } catch (err) {
        console.log(err);
    }
};
