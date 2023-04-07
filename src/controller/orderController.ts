import { Order, Customer, OrderDetail } from '../model/order';
import { Request, Response } from 'express';
import Product from '../model/product';
const moment = require('moment');
interface OrderProperty {
    customerName: string;
    address: string;
    email: string;
    phoneNumber: number;
    paymentMethod: string;
    productId: number[];
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

const getNewId = async ({ TableName }: { TableName: any }): Promise<number> => {
    const newId: { id: number } = await TableName.findOne({
        attributes: ['id'],
        order: [['id', 'DESC']],
    });
    return newId.id;
};

export const create = async (
    req: Request<{}, {}, OrderProperty, {}>,
    res: Response
): Promise<void> => {
    try {
        const {
            customerName,
            address,
            email,
            phoneNumber,
            paymentMethod,
            productId,
        }: OrderProperty = req.body;
        //Create string date for code
        let dateNow = new Date();

        // Create new user
        await Customer.create({
            name: customerName,
            address: address,
            email: email,
            phone_number: phoneNumber,
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

        const orderDetails = productId.map((id) => ({
            order_id: newIdOrder,
            product_id: id,
        }));

        await OrderDetail.bulkCreate(orderDetails);
        res.send('Created order');
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
        res.send('success');
    } catch (err) {
        console.log(err);
    }
};
