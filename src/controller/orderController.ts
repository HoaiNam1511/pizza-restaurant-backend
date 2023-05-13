import moment from 'moment';
import { Request, Response } from 'express';

import Product from '../model/product';
import { Query } from './index';
import { getNewId } from '../controller/';
import { Order, Customer, OrderDetail } from '../model/order';
interface OrderProperty {
    name: string;
    address: string;
    email: string;
    phone: number;
    paymentMethod: string;
    products: {
        productId: number;
        quantity: number;
        size: string;
    }[];
}

interface OrderUpdate {
    paymentStatus: string;
    orderStatus: string;
    paymentMethod: string;
}

interface OrderUpdateParams {
    id: number;
}

interface CreateCode {
    paymentMethod: string;
    newIdCustomer: number;
}

export const get = async (
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

        const result = await Order.findAndCountAll({
            include: [
                {
                    model: Customer,
                },
                {
                    model: Product,
                    as: 'products',
                },
            ],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });

        const totalPage = Math.ceil(result.count / limit);
        res.send({
            totalPage: totalPage,
            data: result.rows,
        });
    } catch (err) {
        console.log(err);
    }
};

const createCode = ({ paymentMethod, newIdCustomer }: CreateCode): string => {
    const dateNow = new Date();
    let code = `${paymentMethod.slice(
        0,
        3
    )}${dateNow.getSeconds()}${dateNow.getDate()}${
        dateNow.getMonth() + 1
    }${dateNow.getFullYear()}`;

    code += `ifc${newIdCustomer}`;
    return code;
};

export const create = async (
    req: Request<{}, {}, OrderProperty, {}>,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            address,
            email,
            phone,
            paymentMethod,
            products,
        }: OrderProperty = req.body;
        //Create string date for code
        let dateNow = new Date();

        // Create new user
        await Customer.create({
            name: name,
            address: address,
            email: email.toLowerCase(),
            phone_number: phone,
        });

        //Get new id off customer
        const newIdCustomer: number = await getNewId({ TableName: Customer });
        // Create code
        const code = createCode({ paymentMethod, newIdCustomer });

        await Order.create({
            order_code: code,
            customer_id: newIdCustomer,
            order_date: moment(dateNow, 'MM-DD-YYYY'),
            order_status: 'pending',
            payment_method: paymentMethod,
            payment_status: 'unpaid',
        });

        const newIdOrder: number = await getNewId({ TableName: Order });

        const orderDetails = products.map((product) => ({
            order_id: newIdOrder,
            product_id: product.productId,
            quantity: product.quantity,
            size: product.size,
        }));

        await OrderDetail.bulkCreate(orderDetails);
        res.send({
            message: 'Create order success',
            action: 'add',
        });
    } catch (err) {
        console.log(err);
    }
};

export const update = async (
    req: Request<OrderUpdateParams, {}, OrderUpdate, {}>,
    res: Response
): Promise<void> => {
    try {
        const { id }: OrderUpdateParams = req.params;
        const { orderStatus, paymentStatus, paymentMethod }: OrderUpdate =
            req.body;

        if (orderStatus === 'shipped' && paymentMethod === 'crash') {
            await Order.update(
                {
                    order_status: orderStatus,
                    payment_status: 'paid',
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
        } else if (orderStatus !== 'shipped' && paymentMethod === 'crash') {
            await Order.update(
                {
                    order_status: orderStatus,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
        } else {
            await Order.update(
                {
                    order_status: orderStatus,
                    payment_status: paymentStatus,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
        }
        res.send({
            message: 'Update order success',
            action: 'update',
        });
    } catch (err) {
        console.log(err);
    }
};
