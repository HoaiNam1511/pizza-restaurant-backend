import moment from 'moment';
import { Op } from 'sequelize';
import { Request, Response } from 'express';

import Product from '../model/product';
import { Query } from './index';
import { getNewId, getWeek, Week } from '../controller/';
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

interface TotalOrder {
    orderQuantity: number;
    subTotal: number;
    orderSale: number;
    chartData: any;
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

//Get order
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
            orderStatus,
            paymentStatus,
        }: Query = req.query;
        const offSet = (page - 1) * limit;

        const whereClause: any = {};

        if (paymentStatus) {
            whereClause.payment_status = paymentStatus;
        }

        if (orderStatus) {
            whereClause.order_status = orderStatus;
        }

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
            where: {
                [Op.and]: [whereClause],
            },
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

//Function create code of order
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

//Create order
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

//Update order
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

//Get order off week
export const orderOfWeek = async (
    req: Request<{}, {}, {}, {}>,
    res: Response
) => {
    const { startOfWeek, endOfWeek }: Week = getWeek();
    const result = await totalOrder({
        startPoint: startOfWeek,
        endPoint: endOfWeek,
    });

    res.send(result);
};

export const totalOrder = async ({
    startPoint,
    endPoint,
}: {
    startPoint: string;
    endPoint: string;
}): Promise<TotalOrder> => {
    const result = await Order.findAll({
        attributes: ['id', 'order_date'],
        include: [
            {
                model: Product,
                as: 'products',
                attributes: ['price'],
                through: { attributes: ['quantity'] },
            },
        ],
        where: {
            order_date: {
                [Op.gt]: startPoint,
            },
        },
        order: [['order_date', 'DESC']],
    });

    const modifiedData = result.map((item: any) => {
        const { id, order_date, products } = item;

        const modifiedProducts = products.map((product: any) => {
            const { price, order_details } = product;
            return { price, quantity: order_details.quantity };
        });

        return {
            id,
            date: moment(order_date, 'YYYY.MM.DD').format('DD-MM-YYYY'),
            products: modifiedProducts,
        };
    });
    return modifiedData;
};
